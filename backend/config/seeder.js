const User = require('../models/User');
const Setting = require('../models/Setting');
const About = require('../models/About');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const Faq = require('../models/Faq');
const Pricing = require('../models/Pricing');
const Timeline = require('../models/Timeline');
const TechStack = require('../models/TechStack');
const Process = require('../models/Process');
const Team = require('../models/Team');

exports.seedDatabase = async () => {
  try {
    // 1. Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'dipendra@steptrendy.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'upadhayaydipendra621@@';
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        _id: '60d5ec49c1851e22247f0001',
        name: 'StepTrendy Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`👤 Default Admin Seeded: ${adminEmail}`);
    }

    // 2. Settings
    const settingExists = await Setting.findOne();
    if (!settingExists) {
      await Setting.create({
        websiteName: 'StepTrendy Technologies',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        copyrightText: '© 2026 StepTrendy Technologies Pvt. Ltd. All rights reserved.',
        emails: ['info@steptrendy.com', 'dipendra@steptrendy.com'],
        phoneNumbers: ['+977-9800000000', '+91-9800000000'],
        addresses: ['Surat, Gujarat, India', 'Kathmandu, Nepal'],
        whatsapp: '+9779800000000',
        workingHours: [
          { days: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
          { days: 'Saturday', time: '10:00 AM - 4:00 PM' }
        ],
        socials: [
          { name: 'Facebook', icon: 'Facebook', link: 'https://facebook.com' },
          { name: 'Twitter', icon: 'Twitter', link: 'https://twitter.com' },
          { name: 'LinkedIn', icon: 'Linkedin', link: 'https://linkedin.com' },
          { name: 'GitHub', icon: 'Github', link: 'https://github.com' }
        ]
      });
      console.log(`⚙️ Settings Seeded`);
    }

    // 3. About Us
    const aboutExists = await About.countDocuments();
    if (aboutExists === 0) {
      const items = [
        { topic: 'Who We Are', detail: 'StepTrendy Technologies Pvt. Ltd. is a global technology consulting and software services company. We build digital products that scale and impact lives.', photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60', order: 1 },
        { topic: 'Our Mission', detail: 'To empower organizations by delivering premium web, mobile, and custom software solutions designed with modern aesthetics and top-tier performance.', photo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=60', order: 2 },
        { topic: 'Our Vision', detail: 'To become a global leader in software development, known for our futuristic design aesthetics, robust architecture, and customer-first approach.', photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60', order: 3 }
      ];
      for (const item of items) { await About.create(item); }
      console.log(`🏢 About Us Section Seeded`);
    }

    // 4. Services
    const serviceExists = await Service.countDocuments();
    if (serviceExists === 0) {
      const items = [
        { title: 'Web Development', description: 'Next-gen web applications built with React, Next.js, and Node.js.', shortDescription: 'Futuristic responsive web products.', category: 'web', icon: 'Globe', price: '₹45,000', duration: '4 Weeks', featured: true },
        { title: 'Mobile App Development', description: 'Cross-platform mobile apps for iOS and Android using Flutter.', shortDescription: 'Sleek mobile app interfaces.', category: 'mobile', icon: 'Smartphone', price: '₹60,000', duration: '6 Weeks', featured: true },
        { title: 'UI/UX Design', description: 'Creative prototypes and visual identity designs using Figma.', shortDescription: 'Wow-factor interface blueprints.', category: 'ui-ux', icon: 'Palette', price: '₹15,000', duration: '2 Weeks', featured: true },
        { title: 'AI Solutions', description: 'Custom integration of OpenAI, Gemini, and intelligent automation.', shortDescription: 'Machine learning & automation integration.', category: 'ai', icon: 'Cpu', price: '₹90,000', duration: '8 Weeks', featured: true }
      ];
      for (const item of items) { await Service.create(item); }
      console.log(`💼 Services Seeded`);
    }

    // 5. Portfolio (Our Work)
    const portfolioExists = await Portfolio.countDocuments();
    if (portfolioExists === 0) {
      const items = [
        { title: 'Trendy-Fi E-Commerce', category: 'web', client: 'Trendy Retailers', description: 'A state-of-the-art Web3-enabled retail platform.', coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60', liveUrl: 'https://trendy-fi.example.com', featured: true },
        { title: 'FitLog Workout Tracker', category: 'mobile', client: 'FitLog Inc.', description: 'Mobile app tracking body metrics and habits.', coverImage: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=800&auto=format&fit=crop&q=60', liveUrl: 'https://fitlog.example.com', featured: true },
        { title: 'MedTrack Portal', category: 'software', client: 'MedTrack Health', description: 'Custom hospital management portal.', coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60', liveUrl: 'https://medtrack.example.com', featured: true }
      ];
      for (const item of items) { await Portfolio.create(item); }
      console.log(`🎨 Portfolio Seeded`);
    }

    // 6. Testimonials
    const testimonialExists = await Testimonial.countDocuments();
    if (testimonialExists === 0) {
      const items = [
        { name: 'Aarav Sharma', role: 'CEO', company: 'TechVibe', feedback: 'StepTrendy delivered our web platform on time and with incredible aesthetics. Truly premium!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', rating: 5, project: 'TechVibe Web app' },
        { name: 'Kripa Upadhyay', role: 'Product Manager', company: 'Healthify', feedback: 'The mobile app developed by StepTrendy is very smooth. Our users love the interactive design.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', rating: 5, project: 'Healthify App' }
      ];
      for (const item of items) { await Testimonial.create(item); }
      console.log(`⭐️ Testimonials Seeded`);
    }

    // 7. FAQs
    const faqExists = await Faq.countDocuments();
    if (faqExists === 0) {
      await Faq.insertMany([
        { question: 'What tech stack do you use?', answer: 'We primarily specialize in the MERN stack (MongoDB, Express, React, Node.js), along with Flutter for mobile, Supabase, Tailwind CSS, and cloud platforms like GCF and Vercel.', order: 1 },
        { question: 'How long does a typical web project take?', answer: 'A standard web application project takes between 4 to 8 weeks, depending on the complexity of features and design requirements.', order: 2 },
        { question: 'Do you offer post-deployment support?', answer: 'Yes, we provide 3 months of free maintenance and support post-launch for all our custom software products.', order: 3 }
      ]);
      console.log(`❓ FAQs Seeded`);
    }

    // 8. Pricing
    const pricingExists = await Pricing.countDocuments();
    if (pricingExists === 0) {
      await Pricing.insertMany([
        { name: 'Starter Plan', price: '15,000', currency: 'INR', features: ['UI/UX Wireframes', 'Single Page Responsive Landing', 'Contact Form Integration', 'Basic SEO Setup'], order: 1 },
        { name: 'Premium Plan', price: '45,000', currency: 'INR', features: ['Full Custom React Web App', 'Admin Dashboard (Basic)', 'CORS & Database Backend', 'Cloud Deployment Ready'], featured: true, order: 2 },
        { name: 'Custom Suite', price: 'Contact Us', currency: 'INR', features: ['Enterprise Software Development', 'Native Mobile Apps (iOS & Android)', 'Advanced AI & API integrations', 'Dedicated Support Contract'], order: 3 }
      ]);
      console.log(`💰 Pricing Seeded`);
    }

    // 9. Timeline (Journey)
    const timelineExists = await Timeline.countDocuments();
    if (timelineExists === 0) {
      await Timeline.insertMany([
        { year: '2022', title: 'Company Inception', desc: 'StepTrendy was founded with a small, passionate team of designers and developers, aiming to redefine digital agency delivery.', order: 1 },
        { year: '2024', title: 'Global Delivery & Team Expansion', desc: 'Scaled operations internationally, delivering 50+ successful web and mobile products across 5 countries.', order: 2 },
        { year: '2026', title: 'AI Solutions & Modern Agency Model', desc: 'Introduced custom AI integrations and shifted entirely to high-end glassmorphism UI blueprints.', order: 3 }
      ]);
      console.log(`🗓 Timeline Journey Seeded`);
    }

    // 10. Tech Stack
    const techExists = await TechStack.countDocuments();
    if (techExists === 0) {
      await TechStack.insertMany([
        { name: 'React.js', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', order: 1 },
        { name: 'Node.js', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', order: 2 },
        { name: 'Flutter', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', order: 3 },
        { name: 'Figma', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', order: 4 },
        { name: 'Tailwind CSS', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', order: 5 },
        { name: 'MongoDB', photo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', order: 6 }
      ]);
      console.log(`💻 Tech Stack Seeded`);
    }

    // 11. Process
    const processExists = await Process.countDocuments();
    if (processExists === 0) {
      await Process.insertMany([
        { step: '01', name: 'Discovery Call', photo: 'Search', description: 'Aligning on business goals, requirements, and product vision.', order: 1 },
        { step: '02', name: 'Strategic Planning', photo: 'Briefcase', description: 'Architecting system designs, timelines, and choosing the tech stack.', order: 2 },
        { step: '03', name: 'Interactive Wireframing', photo: 'Layout', description: 'Designing Figma prototypes focused on premium visuals and UX.', order: 3 },
        { step: '04', name: 'Development Phase', photo: 'Code', description: 'Coding frontend interfaces and setting up secure databases/backends.', order: 4 }
      ]);
      console.log(`⚙️ Process Steps Seeded`);
    }

    // 12. Team
    const teamExists = await Team.countDocuments();
    if (teamExists === 0) {
      await Team.insertMany([
        { name: 'Dipendra Upadhyay', role: 'Founder & CEO', email: 'dipendra@steptrendy.com', phone: '+977-9800000000', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60', socialLinks: [{ name: 'LinkedIn', link: 'https://linkedin.com' }], order: 1 },
        { name: 'Ananya Roy', role: 'CTO & Head of Engineering', email: 'ananya@steptrendy.com', phone: '+91-9800000000', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=60', socialLinks: [{ name: 'GitHub', link: 'https://github.com' }], order: 2 }
      ]);
      console.log(`👥 Team Members Seeded`);
    }

  } catch (err) {
    console.error(`❌ Seeding error: ${err.message}`);
  }
};
