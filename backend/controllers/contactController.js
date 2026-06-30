const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to, subject, html
  });
};

// @desc  Submit contact form
// @route POST /api/contact
exports.submit = async (req, res, next) => {
  try {
    const { name, email, phone, company, budget, projectDetails } = req.body;
    const contact = await Contact.create({
      name, email, phone, company, budget, projectDetails,
      ipAddress: req.ip
    });

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.SMTP_USER,
        subject: `New Inquiry from ${name} - StepTrendy`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #5B8CFF;">New Project Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
            <p><strong>Project Details:</strong></p>
            <p>${projectDetails}</p>
          </div>
        `
      });

      // Send confirmation to user
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting StepTrendy Technologies!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: white; padding: 40px;">
            <h2 style="color: #5B8CFF;">Thank You, ${name}!</h2>
            <p>We've received your inquiry and will get back to you within 24 hours.</p>
            <p>Our team will review your project requirements and prepare a custom proposal for you.</p>
            <br/>
            <p>Best Regards,<br/><strong>StepTrendy Technologies Pvt. Ltd.</strong></p>
            <p style="color: #5B8CFF;">Design. Develop. Deliver.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Your inquiry has been submitted! We will contact you soon.', data: contact });
  } catch (err) { next(err); }
};

// @desc  Get all contacts (admin)
// @route GET /api/contact
exports.getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, count: contacts.length, total, data: contacts });
  } catch (err) { next(err); }
};

// @desc  Update contact status
// @route PUT /api/contact/:id
exports.updateStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

// @desc  Delete contact
// @route DELETE /api/contact/:id
exports.remove = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};
