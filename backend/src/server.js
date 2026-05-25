require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const connectDB = require('./config/database');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const applicationRoutes = require('./routes/application');
const courseRoutes = require('./routes/course');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

// Passport config
require('./config/passport');

const app = express();

// Connect DB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'https://we-intern.in',
      'https://we-intern-frontend-oo3jbhn3g-weintern-fullstack.vercel.app',
      'https://we-intern.in',
      'https://we-intern-frontend-oo3jbhn3g-weintern-fullstack.vercel.app',
      'https://www.we-intern.in',
      process.env.FRONTEND_URL,
      'http://localhost:3000'
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Rate limiting
app.use('/api/', generalLimiter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WeIntern Server running on port ${PORT}`);
});

module.exports = app;
