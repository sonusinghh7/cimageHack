const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Remove existing admin with same username
    await Admin.deleteOne({ username: 'admin' });

    await Admin.create({
      username: 'admin',
      password: 'admin123',
      name: 'Super Admin',
      email: 'admin@cimage.in',
      role: 'superadmin',
      isActive: true,
    });

    console.log('✅ Admin created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Portal:   http://localhost:5173/admin');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
