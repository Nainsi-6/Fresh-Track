// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// app.get("/", (req, res) => {
//   res.send("FreshTrack backend is running!");
// });

// // app.use("/api/food", require("./routes/foodRoutes"));

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const helmet = require("helmet")
// const rateLimit = require("express-rate-limit")
// const compression = require("compression")
// const morgan = require("morgan")
// require("dotenv").config()

// // Import routes
// const authRoutes = require("./routes/authRoutes")
// const productRoutes = require("./routes/productRoutes")
// const donationRoutes = require("./routes/donationRoutes")
// const analyticsRoutes = require("./routes/analyticsRoutes")
// const alertRoutes = require("./routes/alertRoutes")
// const userRoutes = require("./routes/userRoutes")
// const mlRoutes = require("./routes/mlRoutes")

// // Import ML components
// const SpoilagePredictor = require("./ml/predictor")
// const MLModelTrainer = require("./ml/modelTrainer")

// const app = express()

// // Security middleware
// app.use(helmet())
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// )

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// })
// app.use(limiter)

// // Body parsing middleware
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// // Compression middleware
// app.use(compression())

// // Logging middleware
// app.use(morgan("combined"))

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/freshtrack", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ Connected to MongoDB")

//     // Initialize ML components after DB connection
//     initializeMLComponents()
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err)
//     process.exit(1)
//   })

// // Initialize ML components
// async function initializeMLComponents() {
//   try {
//     console.log("🤖 Initializing ML components...")

//     const predictor = new SpoilagePredictor()
//     const trainer = new MLModelTrainer()

//     // Check if model exists, if not train it
//     const modelInfo = predictor.getModelInfo()
//     if (!modelInfo) {
//       console.log("📚 No trained model found. Training new model...")
//       try {
//         await trainer.trainModel()
//         console.log("✅ ML model trained successfully")
//       } catch (error) {
//         console.warn("⚠️ ML model training failed, will use fallback predictions:", error.message)
//       }
//     } else {
//       console.log(
//         `✅ ML model loaded (version: ${modelInfo.version}, accuracy: ${(modelInfo.accuracy * 100).toFixed(1)}%)`,
//       )
//     }
//   } catch (error) {
//     console.error("❌ ML initialization error:", error.message)
//   }
// }

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || "development",
//     version: "1.0.0",
//   })
// })

// // API Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/products", productRoutes)
// app.use("/api/donations", donationRoutes)
// app.use("/api/analytics", analyticsRoutes)
// app.use("/api/alerts", alertRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/ml", mlRoutes)

// // Welcome route
// app.get("/", (req, res) => {
//   res.json({
//     message: "🥬 Welcome to FreshTrack API",
//     version: "1.0.0",
//     documentation: "/api/docs",
//     health: "/health",
//     features: [
//       "🔐 Authentication & Authorization",
//       "📦 Product Management",
//       "🤝 Donation System",
//       "📊 Analytics & Reporting",
//       "🚨 Smart Alerts",
//       "🤖 ML-Powered Spoilage Prediction",
//       "🏪 Multi-store Support",
//       "📱 Real-time Updates",
//     ],
//   })
// })

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err)

//   // Mongoose validation error
//   if (err.name === "ValidationError") {
//     const errors = Object.values(err.errors).map((e) => e.message)
//     return res.status(400).json({
//       success: false,
//       message: "Validation Error",
//       errors,
//     })
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0]
//     return res.status(400).json({
//       success: false,
//       message: `${field} already exists`,
//     })
//   }

//   // JWT errors
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     })
//   }

//   if (err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       message: "Token expired",
//     })
//   }

//   // Default error
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   })
// })

// // Handle 404
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   })
// })

// const PORT = process.env.PORT

// app.listen(PORT, () => {
//   console.log(`🚀 FreshTrack server running on port ${PORT}`)
//   console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
//   console.log(`📊 Health check: http://localhost:${PORT}/health`)
//   console.log(`📚 API docs: http://localhost:${PORT}/api`)
// })

// module.exports = app

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// require("dotenv").config();

// // ML Imports
// const { SpoilagePredictor } = require("./ml/predictor");

// const MLModelTrainer = require("./ml/modelTrainer");

// // API Routes
// const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");
// const analyticsRoutes = require("./routes/analyticsRoutes");
// const alertRoutes = require("./routes/alertRoutes");
// const donationRoutes = require("./routes/donationRoutes");
// const mlRoutes = require("./routes/mlRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use("/api/", limiter);

// // Logger
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// // Health check
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || "development",
//   });
// });

// // Route bindings
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/alerts", alertRoutes);
// app.use("/api/donations", donationRoutes);
// app.use("/api/ml", mlRoutes);

// // Catch 404
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Error handler
// app.use((error, req, res, next) => {
//   console.error("Global error handler:", error);

//   res.status(error.status || 500).json({
//     success: false,
//     message: error.message || "Internal server error",
//     ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//   });
// });

// // MongoDB + ML initializer
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/freshtrack", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");

//     // Server startup
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
//       console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
//     });

//     // ML initializer
//     initializeMLComponents();
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   });

// // ML Initialization Logic
// async function initializeMLComponents() {
//   try {
//     console.log("🤖 Initializing ML components...");

//     const predictor = new SpoilagePredictor();
//     const trainer = new MLModelTrainer();

//     const modelInfo = predictor.getModelInfo();
//     if (!modelInfo) {
//       console.log("📚 No trained model found. Training new model...");
//       try {
//         await trainer.trainModel();
//         console.log("✅ ML model trained successfully");
//       } catch (error) {
//         console.warn("⚠️ ML model training failed. Using fallback predictions:", error.message);
//       }
//     } else {
//       console.log(
//         `✅ ML model loaded (version: ${modelInfo.version}, accuracy: ${(modelInfo.accuracy * 100).toFixed(1)}%)`
//       );
//     }
//   } catch (error) {
//     console.error("❌ ML initialization error:", error.message);
//   }
// }

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received, shutting down gracefully");
//   mongoose.connection.close(() => {
//     console.log("MongoDB connection closed");
//     process.exit(0);
//   });
// });

// process.on("SIGINT", () => {
//   console.log("SIGINT received, shutting down gracefully");
//   mongoose.connection.close(() => {
//     console.log("MongoDB connection closed");
//     process.exit(0);
//   });
// });

// module.exports = app;

// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const helmet = require("helmet")
// const rateLimit = require("express-rate-limit")
// require("dotenv").config()

// // ML Imports
// const SpoilagePredictor = require("./ml/predictor")
// const MLModelTrainer = require("./ml/modelTrainer")

// // API Routes
// const authRoutes = require("./routes/authRoutes")
// const productRoutes = require("./routes/productRoutes")
// const analyticsRoutes = require("./routes/analyticsRoutes")
// const alertRoutes = require("./routes/alertRoutes")
// const donationRoutes = require("./routes/donationRoutes")
// const mlRoutes = require("./routes/mlRoutes")

// const app = express()
// const PORT = process.env.PORT || 5003

// // Middleware
// app.use(helmet())
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// )
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// })
// app.use("/api/", limiter)

// // Logger
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
//   next()
// })

// // Health check
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || "development",
//   })
// })

// // Route bindings
// app.use("/api/auth", authRoutes)
// app.use("/api/products", productRoutes)
// app.use("/api/analytics", analyticsRoutes)
// app.use("/api/alerts", alertRoutes)
// app.use("/api/donations", donationRoutes)
// app.use("/api/ml", mlRoutes)

// // Catch 404
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   })
// })

// // Error handler
// app.use((error, req, res, next) => {
//   console.error("Global error handler:", error)
//   res.status(error.status || 500).json({
//     success: false,
//     message: error.message || "Internal server error",
//     ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//   })
// })

// // MongoDB + ML initializer
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/freshtrack", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB")

//     // Server startup
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`)
//       console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
//       console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
//     })

//     // ML initializer
//     initializeMLComponents()
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error)
//     process.exit(1)
//   })

// // ML Initialization Logic
// async function initializeMLComponents() {
//   try {
//     console.log("🤖 Initializing ML components...")
//     const predictor = new SpoilagePredictor()
//     const trainer = new MLModelTrainer()

//     const modelInfo = predictor.getModelInfo()
//     if (!modelInfo) {
//       console.log("📚 No trained model found. Training new model...")
//       try {
//         await trainer.trainModel()
//         console.log("✅ ML model trained successfully")
//       } catch (error) {
//         console.warn("⚠️ ML model training failed. Using fallback predictions:", error.message)
//       }
//     } else {
//       console.log(
//         `✅ ML model loaded (version: ${modelInfo.version}, accuracy: ${(modelInfo.accuracy * 100).toFixed(1)}%)`,
//       )
//     }
//   } catch (error) {
//     console.error("❌ ML initialization error:", error.message)
//   }
// }

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received, shutting down gracefully")
//   mongoose.connection.close(() => {
//     console.log("MongoDB connection closed")
//     process.exit(0)
//   })
// })

// process.on("SIGINT", () => {
//   console.log("SIGINT received, shutting down gracefully")
//   mongoose.connection.close(() => {
//     console.log("MongoDB connection closed")
//     process.exit(0)
//   })
// })

// module.exports = app









// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const helmet = require("helmet")
// const rateLimit = require("express-rate-limit")
// require("dotenv").config()

// // Services
// const excelDataService = require("./services/excelDataService")
// const nlpFeedbackService = require("./services/nlpFeedbackService")

// // API Routes
// const authRoutes = require("./routes/authRoutes")
// const productRoutes = require("./routes/productRoutes")
// const analyticsRoutes = require("./routes/analyticsRoutes")
// const alertRoutes = require("./routes/alertRoutes")
// const donationRoutes = require("./routes/donationRoutes")
// const mlRoutes = require("./routes/mlRoutes")
// const feedbackRoutes = require("./routes/feedbackRoutes")

// const app = express()
// const PORT = process.env.PORT || 5003

// // Middleware
// app.use(helmet())
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// )
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// })
// app.use("/api/", limiter)

// // Logger
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
//   next()
// })

// // Health check with FreshTrack data status
// app.get("/health", (req, res) => {
//   const datasets = excelDataService.getAllFreshTrackData()
//   const dataStatus = {
//     inventory: datasets.inventory.length,
//     feedback: datasets.feedback.length,
//     environment: datasets.environment.length,
//     donations: datasets.donations.length,
//     actionLog: datasets.actionLog.length,
//     spoilageLog: datasets.spoilageLog.length,
//   }

//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || "development",
//     freshTrackData: dataStatus,
//     totalRecords: Object.values(dataStatus).reduce((sum, count) => sum + count, 0),
//   })
// })

// // Route bindings
// app.use("/api/auth", authRoutes)
// app.use("/api/products", productRoutes)
// app.use("/api/analytics", analyticsRoutes)
// app.use("/api/alerts", alertRoutes)
// app.use("/api/donations", donationRoutes)
// app.use("/api/ml", mlRoutes)
// app.use("/api/feedback", feedbackRoutes)

// // FreshTrack data endpoint
// app.get("/api/freshtrack/data-status", (req, res) => {
//   try {
//     const datasets = excelDataService.getAllFreshTrackData()
//     const enrichedInventory = excelDataService.getEnrichedInventoryData()
//     const donationOpportunities = excelDataService.getDonationOpportunities()
//     const ngos = excelDataService.getNGOData()

//     res.json({
//       success: true,
//       data: {
//         datasets: {
//           inventory: datasets.inventory.length,
//           feedback: datasets.feedback.length,
//           environment: datasets.environment.length,
//           donations: datasets.donations.length,
//           actionLog: datasets.actionLog.length,
//           spoilageLog: datasets.spoilageLog.length,
//         },
//         processed: {
//           enrichedProducts: enrichedInventory.length,
//           donationOpportunities: donationOpportunities.length,
//           ngoPartners: ngos.length,
//         },
//         lastUpdated: new Date().toISOString(),
//         systemStatus: "active",
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get FreshTrack data status",
//       error: error.message,
//     })
//   }
// })

// // Catch 404
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   })
// })

// // Error handler
// app.use((error, req, res, next) => {
//   console.error("Global error handler:", error)
//   res.status(error.status || 500).json({
//     success: false,
//     message: error.message || "Internal server error",
//     ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//   })
// })

// // MongoDB connection (optional - you can use Excel data only)
// if (process.env.MONGODB_URI) {
//   mongoose
//     .connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log("Connected to MongoDB")
//       startServer()
//     })
//     .catch((error) => {
//       console.error("MongoDB connection error:", error)
//       console.log("Starting server without MongoDB (Excel data only)")
//       startServer()
//     })
// } else {
//   console.log("No MongoDB URI provided, using Excel data only")
//   startServer()
// }

// function startServer() {
//   app.listen(PORT, () => {
//     console.log(`🚀 FreshTrack Server running on port ${PORT}`)
//     console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
//     console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)

//     // Initialize FreshTrack data
//     initializeFreshTrackData()
//   })
// }

// async function initializeFreshTrackData() {
//   try {
//     console.log("🤖 Initializing FreshTrack Excel data...")

//     const datasets = excelDataService.getAllFreshTrackData()
//     const totalRecords = Object.values(datasets).reduce((sum, data) => sum + data.length, 0)

//     console.log(`📊 FreshTrack Data Loaded:`)
//     console.log(`   Inventory: ${datasets.inventory.length} products`)
//     console.log(`   Feedback: ${datasets.feedback.length} reviews`)
//     console.log(`   Environment: ${datasets.environment.length} readings`)
//     console.log(`   Donations: ${datasets.donations.length} records`)
//     console.log(`   Action Log: ${datasets.actionLog.length} actions`)
//     console.log(`   Spoilage Log: ${datasets.spoilageLog.length} entries`)
//     console.log(`   Total Records: ${totalRecords}`)

//     // Test NLP analysis
//     const feedbackAnalysis = nlpFeedbackService.getFeedbackAnalysis()
//     console.log(`🧠 NLP Analysis: ${feedbackAnalysis.summary?.totalReviews || 0} reviews processed`)

//     console.log("✅ FreshTrack system initialized successfully!")
//   } catch (error) {
//     console.error("❌ FreshTrack initialization error:", error.message)
//   }
// }

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received, shutting down gracefully")
//   if (mongoose.connection.readyState === 1) {
//     mongoose.connection.close(() => {
//       console.log("MongoDB connection closed")
//       process.exit(0)
//     })
//   } else {
//     process.exit(0)
//   }
// })

// process.on("SIGINT", () => {
//   console.log("SIGINT received, shutting down gracefully")
//   if (mongoose.connection.readyState === 1) {
//     mongoose.connection.close(() => {
//       console.log("MongoDB connection closed")
//       process.exit(0)
//     })
//   } else {
//     process.exit(0)
//   }
// })

// module.exports = app




const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Services
const excelDataService = require("./services/excelDataService")
const nlpFeedbackService = require("./services/nlpFeedbackService")

// API Routes
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const alertRoutes = require("./routes/alertRoutes")
const donationRoutes = require("./routes/donationRoutes")
const mlRoutes = require("./routes/mlRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes")
const ngoRoutes = require("./routes/ngoRoutes")

const app = express()
const PORT = process.env.PORT || 5003

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check with FreshTrack data status
app.get("/health", (req, res) => {
  const datasets = excelDataService.getAllFreshTrackData()
  const dataStatus = {
    inventory: datasets.inventory.length,
    feedback: datasets.feedback.length,
    environment: datasets.environment.length,
    donations: datasets.donations.length,
    actionLog: datasets.actionLog.length,
    spoilageLog: datasets.spoilageLog.length,
  }

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    freshTrackData: dataStatus,
    totalRecords: Object.values(dataStatus).reduce((sum, count) => sum + count, 0),
  })
})

// Route bindings
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/donations", donationRoutes)
app.use("/api/ml", mlRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/ngos", ngoRoutes)

// FreshTrack data endpoint
app.get("/api/freshtrack/data-status", (req, res) => {
  try {
    const datasets = excelDataService.getAllFreshTrackData()
    const enrichedInventory = excelDataService.getEnrichedInventoryData()
    const donationOpportunities = excelDataService.getDonationOpportunities()
    const ngos = excelDataService.getNGOData()

    res.json({
      success: true,
      data: {
        datasets: {
          inventory: datasets.inventory.length,
          feedback: datasets.feedback.length,
          environment: datasets.environment.length,
          donations: datasets.donations.length,
          actionLog: datasets.actionLog.length,
          spoilageLog: datasets.spoilageLog.length,
        },
        processed: {
          enrichedProducts: enrichedInventory.length,
          donationOpportunities: donationOpportunities.length,
          ngoPartners: ngos.length,
        },
        lastUpdated: new Date().toISOString(),
        systemStatus: "active",
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get FreshTrack data status",
      error: error.message,
    })
  }
})

// Catch 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// MongoDB connection (optional - you can use Excel data only)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB")
      startServer()
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error)
      console.log("Starting server without MongoDB (Excel data only)")
      startServer()
    })
} else {
  console.log("No MongoDB URI provided, using Excel data only")
  startServer()
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 FreshTrack Server running on port ${PORT}`)
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)

    // Initialize FreshTrack data
    initializeFreshTrackData()
  })
}

async function initializeFreshTrackData() {
  try {
    console.log("🤖 Initializing FreshTrack Excel data...")

    const datasets = excelDataService.getAllFreshTrackData()
    const totalRecords = Object.values(datasets).reduce((sum, data) => sum + data.length, 0)

    console.log(`📊 FreshTrack Data Loaded:`)
    console.log(`   Inventory: ${datasets.inventory.length} products`)
    console.log(`   Feedback: ${datasets.feedback.length} reviews`)
    console.log(`   Environment: ${datasets.environment.length} readings`)
    console.log(`   Donations: ${datasets.donations.length} records`)
    console.log(`   Action Log: ${datasets.actionLog.length} actions`)
    console.log(`   Spoilage Log: ${datasets.spoilageLog.length} entries`)
    console.log(`   Total Records: ${totalRecords}`)

    // Test NLP analysis
    const feedbackAnalysis = nlpFeedbackService.getFeedbackAnalysis()
    console.log(`🧠 NLP Analysis: ${feedbackAnalysis.summary?.totalReviews || 0} reviews processed`)

    console.log("✅ FreshTrack system initialized successfully!")
  } catch (error) {
    console.error("❌ FreshTrack initialization error:", error.message)
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed")
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed")
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
})

module.exports = app
