const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class QueryBuilder {
  constructor(sequelizeModel, where, modelName) {
    this.model = sequelizeModel;
    this.where = where;
    this.modelName = modelName;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._select = null;
  }

  sort(sortVal) {
    this._sort = sortVal;
    return this;
  }

  skip(skipVal) {
    this._skip = Number(skipVal);
    return this;
  }

  limit(limitVal) {
    this._limit = Number(limitVal);
    return this;
  }

  select(selectVal) {
    this._select = selectVal;
    return this;
  }

  populate() {
    return this;
  }

  lean() {
    return this;
  }

  async then(resolve, reject) {
    try {
      const options = { where: this.where };

      // Sorting
      if (this._sort) {
        const order = [];
        if (typeof this._sort === 'string') {
          const parts = this._sort.trim().split(/\s+/);
          for (const p of parts) {
            if (p.startsWith('-')) {
              order.push([p.substring(1), 'DESC']);
            } else {
              order.push([p, 'ASC']);
            }
          }
        } else if (typeof this._sort === 'object') {
          for (const [k, v] of Object.entries(this._sort)) {
            order.push([k, v === -1 || v === 'desc' || v === 'DESC' ? 'DESC' : 'ASC']);
          }
        }
        options.order = order;
      }

      // Pagination
      if (this._limit !== null) {
        options.limit = this._limit;
      }
      if (this._skip > 0) {
        options.offset = this._skip;
      }

      const instances = await this.model.findAll(options);
      const docs = instances.map(inst => createMongooseDocument(inst, this.modelName, this._select));
      resolve(docs);
    } catch (err) {
      reject(err);
    }
  }
}

class SingleQueryBuilder {
  constructor(sequelizeModel, queryType, queryVal, modelName) {
    this.model = sequelizeModel;
    this.queryType = queryType;
    this.queryVal = queryVal;
    this.modelName = modelName;
    this._select = null;
  }

  select(selectVal) {
    this._select = selectVal;
    return this;
  }

  populate() {
    return this;
  }

  lean() {
    return this;
  }

  async then(resolve, reject) {
    try {
      let inst;
      if (this.queryType === 'findById') {
        if (!this.queryVal) {
          inst = null;
        } else {
          inst = await this.model.findByPk(this.queryVal);
        }
      } else {
        inst = await this.model.findOne({ where: this.queryVal });
      }
      const doc = createMongooseDocument(inst, this.modelName, this._select);
      resolve(doc);
    } catch (err) {
      reject(err);
    }
  }
}

function createMongooseDocument(inst, modelName, selectVal = null) {
  if (!inst) return null;
  const data = inst.toJSON ? inst.toJSON() : inst;
  
  // Mongoose compat mapping
  const doc = { ...data };
  doc._id = data.id;

  // Handle default select:false for password
  if (modelName === 'User') {
    if (selectVal === '+password') {
      // Keep password
    } else if (selectVal === '-password' || !selectVal) {
      delete doc.password;
    }
  }


  // Define _inst property (non-enumerable)
  Object.defineProperty(doc, '_inst', {
    value: inst,
    writable: true,
    enumerable: false
  });

  // comparePassword for User
  if (modelName === 'User') {
    doc.comparePassword = async function (enteredPassword) {
      const pwd = doc.password || inst.password;
      return await bcrypt.compare(enteredPassword, pwd);
    };

    doc.getSignedJwtToken = function () {
      return jwt.sign(
        { id: doc._id || doc.id, role: doc.role },
        process.env.JWT_SECRET || 'steptrendy_super_secret_key_2024',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
    };
  }

  // save method
  doc.save = async function () {
    // Hash password if modified
    if (modelName === 'User' && doc.password && doc.password !== inst.password) {
      if (!doc.password.startsWith('$2a$') && !doc.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(12);
        doc.password = await bcrypt.hash(doc.password, salt);
      }
    }

    // Update keys
    const keys = Object.keys(doc).filter(k => k !== '_id' && k !== 'save' && k !== '_inst' && typeof doc[k] !== 'function');
    for (const key of keys) {
      inst[key] = doc[key];
    }
    
    await inst.save();
    
    // Sync data back
    const fresh = inst.toJSON();
    Object.assign(doc, fresh);
    doc._id = fresh.id;
    if (modelName === 'User' && selectVal !== '+password') {
      delete doc.password;
    }
    return doc;
  };

  return doc;
}

class MongooseCompat {
  constructor(sequelizeModel, modelName) {
    this.model = sequelizeModel;
    this.modelName = modelName;
  }

  _convertQuery(query = {}) {
    if (!query) return {};
    const where = {};
    for (const [key, val] of Object.entries(query)) {
      if (key === '_id') {
        where.id = val;
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        // Handle basic Mongo operators like $gt, $lt, $in, $ne
        const operators = {};
        for (const [op, opVal] of Object.entries(val)) {
          if (op === '$gt') operators[Op.gt] = opVal;
          else if (op === '$gte') operators[Op.gte] = opVal;
          else if (op === '$lt') operators[Op.lt] = opVal;
          else if (op === '$lte') operators[Op.lte] = opVal;
          else if (op === '$in') operators[Op.in] = opVal;
          else if (op === '$ne') operators[Op.ne] = opVal;
          else if (op === '$nin') operators[Op.notIn] = opVal;
          else operators[op] = opVal;
        }
        where[key] = operators;
      } else {
        where[key] = val;
      }
    }
    return where;
  }

  find(query = {}) {
    const where = this._convertQuery(query);
    return new QueryBuilder(this.model, where, this.modelName);
  }

  findOne(query = {}) {
    const where = this._convertQuery(query);
    return new SingleQueryBuilder(this.model, 'findOne', where, this.modelName);
  }

  findById(id) {
    return new SingleQueryBuilder(this.model, 'findById', id, this.modelName);
  }

  async findByIdAndUpdate(id, data, options = {}) {
    const inst = await this.model.findByPk(id);
    if (!inst) return null;

    // Handle $inc
    if (data.$inc) {
      for (const [k, v] of Object.entries(data.$inc)) {
        inst[k] = (inst[k] || 0) + v;
      }
    }

    // Set standard fields
    const fieldsToSet = {};
    for (const [k, v] of Object.entries(data)) {
      if (!k.startsWith('$') && k !== '_id' && k !== 'id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt') {
        fieldsToSet[k] = v;
      }
    }

    if (this.modelName === 'User' && fieldsToSet.password) {
      if (!fieldsToSet.password.startsWith('$2a$') && !fieldsToSet.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(12);
        fieldsToSet.password = await bcrypt.hash(fieldsToSet.password, salt);
      }
    }

    Object.assign(inst, fieldsToSet);
    await inst.save();
    return createMongooseDocument(inst, this.modelName);
  }

  async findByIdAndDelete(id) {
    const inst = await this.model.findByPk(id);
    if (inst) {
      await inst.destroy();
    }
    return createMongooseDocument(inst, this.modelName);
  }

  async create(data) {
    const cleanData = { ...data };
    if (cleanData._id) {
      cleanData.id = cleanData._id;
      delete cleanData._id;
    } else {
      const crypto = require('crypto');
      cleanData.id = crypto.randomUUID();
    }

    if (this.modelName === 'User' && cleanData.password) {
      if (!cleanData.password.startsWith('$2a$') && !cleanData.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(12);
        cleanData.password = await bcrypt.hash(cleanData.password, salt);
      }
    }

    const inst = await this.model.create(cleanData);
    return createMongooseDocument(inst, this.modelName);
  }

  async countDocuments(query = {}) {
    const where = this._convertQuery(query);
    return await this.model.count({ where });
  }

  async insertMany(arr) {
    const docs = [];
    for (const item of arr) {
      docs.push(await this.create(item));
    }
    return docs;
  }

  async deleteMany(query = {}) {
    const where = this._convertQuery(query);
    return await this.model.destroy({ where });
  }
}

module.exports = MongooseCompat;
