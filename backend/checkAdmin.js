require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
(async () => {
  console.log('Using MONGODB_URI:', process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected DB name:', mongoose.connection.name);

  const user = await mongoose.connection.collection('users').findOne({ email: 'admin@weintern.com' });
  if (!user) {
    console.log('RESULT: No user found with that email in this database.');
    process.exit(0);
  }

  console.log('Found user:', { email: user.email, role: user.role, isVerified: user.isVerified, isBlocked: user.isBlocked, hasPassword: !!user.password });

  const matches = await bcrypt.compare('gb3miJGPd6@QiAa', user.password || '');
  console.log('Password matches:', matches);
  process.exit(0);
})();
