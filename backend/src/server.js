require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");

const connectDB = require("./config/database");
const { generalLimiter } = require("./middleware/rateLimiter");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

// Passport config
require("./config/passport");

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration (Production Ready)
const allowedOrigins = [
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',

  // Production
  'https://we-intern.in',
  'https://www.we-intern.in',

  process.env.FRONTEND_URL,
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // Remove trailing slash issue
      const cleanOrigin = origin.replace(/\/$/, "");

      const isAllowed = allowedOrigins.some(
        (allowed) => allowed && cleanOrigin === allowed.replace(/\/$/, ""),
      );

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  }),
);

// Preflight requests
app.options("*", cors());

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Rate Limiting
app.use("/api/", generalLimiter);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WeIntern Server running on port ${PORT}`);
});

module.exports = app;
