// const express = require("express")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { protect } = require("../middleware/auth")
// const SpoilagePredictor = require("../ml/predictor")
// const MLModelTrainer = require("../ml/modelTrainer")
// const router = express.Router()

// // Initialize ML components
// const predictor = new SpoilagePredictor()
// const trainer = new MLModelTrainer()

// // @route   POST /api/ml/predict/:productId
// // @desc    Get ML prediction for specific product
// // @access  Private
// router.post("/predict/:productId", protect, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     let prediction
//     try {
//       // Try to use the trained ML model
//       prediction = await predictor.predict(product)
//     } catch (mlError) {
//       console.warn("ML model prediction failed, using fallback:", mlError.message)
//       // Use fallback prediction if ML model fails
//       prediction = predictor.fallbackPredict(product)
//     }

//     // Update product with new predictions
//     product.predictions = {
//       spoilageRisk: prediction.spoilageRisk,
//       daysLeft: prediction.daysLeft,
//       confidence: prediction.confidence,
//       lastPredicted: new Date(),
//     }

//     // Update status based on prediction
//     product.updateStatus()
//     await product.save()

//     // Create alert if high risk
//     if (prediction.spoilageRisk >= 80) {
//       const existingAlert = await Alert.findOne({
//         "source.productId": product._id,
//         type: "critical",
//         status: "active",
//       })

//       if (!existingAlert) {
//         const alert = new Alert({
//           type: "critical",
//           category: "spoilage",
//           title: `Critical spoilage risk: ${product.name}`,
//           message: `Product ${product.batch} has ${prediction.spoilageRisk}% spoilage risk. Immediate action required.`,
//           priority: "urgent",
//           source: {
//             type: "ml_model",
//             productId: product._id,
//           },
//           data: {
//             confidence: prediction.confidence,
//             currentValue: prediction.spoilageRisk,
//             threshold: 80,
//             modelVersion: prediction.modelVersion,
//             features: prediction.features,
//           },
//           actions: [
//             {
//               type: "discount",
//               description: "Apply 50% discount for quick sale",
//               automated: false,
//             },
//             {
//               type: "donate",
//               description: "Donate to nearby NGO",
//               automated: false,
//             },
//           ],
//         })
//         await alert.save()
//       }
//     }

//     res.json({
//       success: true,
//       message: "Prediction generated successfully",
//       data: {
//         productId: product._id,
//         prediction,
//         updatedStatus: product.status,
//       },
//     })
//   } catch (error) {
//     console.error("ML prediction error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error during prediction",
//       error: error.message,
//     })
//   }
// })

// // @route   POST /api/ml/batch-predict
// // @desc    Run ML predictions for all active products
// // @access  Private
// router.post("/batch-predict", protect, async (req, res) => {
//   try {
//     const { category, limit = 100 } = req.body

//     // Build filter
//     const filter = { isActive: true }
//     if (category) filter.category = category

//     const products = await Product.find(filter).limit(Number.parseInt(limit))

//     let predictions
//     try {
//       // Try batch prediction with ML model
//       predictions = await predictor.batchPredict(products)
//     } catch (mlError) {
//       console.warn("Batch ML prediction failed, using fallback:", mlError.message)
//       // Use fallback for all products
//       predictions = products.map((product) => ({
//         productId: product._id,
//         ...predictor.fallbackPredict(product),
//       }))
//     }

//     const results = []
//     const alerts = []

//     for (let i = 0; i < products.length; i++) {
//       const product = products[i]
//       const prediction = predictions[i]

//       if (prediction.error) {
//         results.push({
//           productId: product._id,
//           error: prediction.error,
//         })
//         continue
//       }

//       try {
//         // Update product
//         product.predictions = {
//           spoilageRisk: prediction.spoilageRisk,
//           daysLeft: prediction.daysLeft,
//           confidence: prediction.confidence,
//           lastPredicted: new Date(),
//         }

//         const oldStatus = product.status
//         product.updateStatus()
//         await product.save()

//         results.push({
//           productId: product._id,
//           name: product.name,
//           batch: product.batch,
//           prediction: {
//             spoilageRisk: prediction.spoilageRisk,
//             confidence: prediction.confidence,
//             daysLeft: prediction.daysLeft,
//           },
//           oldStatus,
//           newStatus: product.status,
//         })

//         // Create alerts for high-risk products
//         if (prediction.spoilageRisk >= 80) {
//           const existingAlert = await Alert.findOne({
//             "source.productId": product._id,
//             type: "critical",
//             status: "active",
//           })

//           if (!existingAlert) {
//             alerts.push({
//               type: "critical",
//               category: "spoilage",
//               title: `Critical spoilage risk: ${product.name}`,
//               message: `Product ${product.batch} has ${prediction.spoilageRisk}% spoilage risk`,
//               source: {
//                 type: "ml_model",
//                 productId: product._id,
//               },
//               data: {
//                 confidence: prediction.confidence,
//                 currentValue: prediction.spoilageRisk,
//                 threshold: 80,
//                 modelVersion: prediction.modelVersion,
//               },
//             })
//           }
//         }
//       } catch (error) {
//         console.error(`Error updating product ${product._id}:`, error)
//         results.push({
//           productId: product._id,
//           error: error.message,
//         })
//       }
//     }

//     // Bulk create alerts
//     if (alerts.length > 0) {
//       await Alert.insertMany(alerts)
//     }

//     // Calculate summary statistics
//     const summary = {
//       totalProcessed: results.length,
//       successful: results.filter((r) => !r.error).length,
//       errors: results.filter((r) => r.error).length,
//       highRisk: results.filter((r) => r.prediction && r.prediction.spoilageRisk >= 80).length,
//       mediumRisk: results.filter(
//         (r) => r.prediction && r.prediction.spoilageRisk >= 50 && r.prediction.spoilageRisk < 80,
//       ).length,
//       lowRisk: results.filter((r) => r.prediction && r.prediction.spoilageRisk < 50).length,
//       alertsCreated: alerts.length,
//     }

//     res.json({
//       success: true,
//       message: "Batch prediction completed",
//       data: {
//         summary,
//         results: results.slice(0, 20), // Return first 20 for response size
//         alertsCreated: alerts.length,
//       },
//     })
//   } catch (error) {
//     console.error("Batch prediction error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error during batch prediction",
//       error: error.message,
//     })
//   }
// })

// // @route   GET /api/ml/model-info
// // @desc    Get ML model information and statistics
// // @access  Private
// router.get("/model-info", protect, async (req, res) => {
//   try {
//     const modelInfo = predictor.getModelInfo()

//     if (!modelInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "No trained model found. Please train the model first.",
//       })
//     }

//     res.json({
//       success: true,
//       data: { modelInfo },
//     })
//   } catch (error) {
//     console.error("Model info error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// })

// module.exports = router


// const express = require("express")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")
// const { SpoilagePredictor } = require("../ml/predictor")

// const router = express.Router()
// const predictor = new SpoilagePredictor()

// // Predict spoilage for single product
// router.post("/predict/:productId", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.productId,
//       storeId: req.user.storeId,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     const prediction = await predictor.predict(product._id)

//     if (prediction) {
//       // Update product with prediction
//       product.predictions = {
//         ...prediction,
//         lastPredicted: new Date(),
//       }
//       await product.save()

//       // Create alert if high risk
//       if (prediction.spoilageRisk > 70) {
//         await Alert.create({
//           title: "High Spoilage Risk Detected",
//           message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//           type: "spoilage",
//           severity: prediction.spoilageRisk > 90 ? "critical" : "high",
//           productId: product._id,
//           userId: req.user._id,
//           storeId: req.user.storeId,
//           metadata: {
//             spoilageRisk: prediction.spoilageRisk,
//             daysUntilSpoilage: prediction.daysUntilSpoilage,
//           },
//         })
//       }
//     }

//     res.json({
//       success: true,
//       data: { prediction },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Prediction failed",
//       error: error.message,
//     })
//   }
// })

// // Batch predict for multiple products
// router.post("/batch-predict", auth, authorize("manager", "admin"), async (req, res) => {
//   try {
//     const { limit = 50, category, status } = req.body

//     const query = {
//       storeId: req.user.storeId,
//       isActive: true,
//     }

//     if (category) query.category = category
//     if (status) query.status = status

//     const products = await Product.find(query).limit(limit)

//     const results = []
//     let alertsCreated = 0

//     for (const product of products) {
//       try {
//         const prediction = await predictor.predict(product._id)

//         if (prediction) {
//           product.predictions = {
//             ...prediction,
//             lastPredicted: new Date(),
//           }
//           await product.save()

//           results.push({
//             productId: product._id,
//             name: product.name,
//             prediction,
//           })

//           // Create alert if high risk
//           if (prediction.spoilageRisk > 70) {
//             await Alert.create({
//               title: "High Spoilage Risk Detected",
//               message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//               type: "spoilage",
//               severity: prediction.spoilageRisk > 90 ? "critical" : "high",
//               productId: product._id,
//               userId: req.user._id,
//               storeId: req.user.storeId,
//               metadata: {
//                 spoilageRisk: prediction.spoilageRisk,
//                 daysUntilSpoilage: prediction.daysUntilSpoilage,
//               },
//             })
//             alertsCreated++
//           }
//         }
//       } catch (error) {
//         console.error(`Prediction failed for product ${product._id}:`, error)
//       }
//     }

//     res.json({
//       success: true,
//       message: `Processed ${results.length} products, created ${alertsCreated} alerts`,
//       data: {
//         results,
//         summary: {
//           processed: results.length,
//           alertsCreated,
//         },
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Batch prediction failed",
//       error: error.message,
//     })
//   }
// })

// // Get model information
// router.get("/model-info", auth, async (req, res) => {
//   try {
//     const info = await predictor.getModelInfo()

//     res.json({
//       success: true,
//       data: { modelInfo: info },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get model info",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

// const express = require("express")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")
// const SpoilagePredictor = require("../ml/predictor")

// const router = express.Router()
// const predictor = new SpoilagePredictor()

// // Predict spoilage for single product
// router.post("/predict/:productId", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.productId,
//       storeId: req.user.storeId,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     const prediction = await predictor.predict(product)

//     if (prediction) {
//       // Update product with prediction
//       product.predictions = {
//         ...prediction,
//         lastPredicted: new Date(),
//       }
//       await product.save()

//       // Create alert if high risk
//       if (prediction.spoilageRisk > 70) {
//         await Alert.create({
//           title: "High Spoilage Risk Detected",
//           message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//           type: "spoilage",
//           severity: prediction.spoilageRisk > 90 ? "critical" : "high",
//           productId: product._id,
//           userId: req.user._id,
//           storeId: req.user.storeId,
//           metadata: {
//             spoilageRisk: prediction.spoilageRisk,
//             daysUntilSpoilage: prediction.daysLeft,
//           },
//         })
//       }
//     }

//     res.json({
//       success: true,
//       data: { prediction },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Prediction failed",
//       error: error.message,
//     })
//   }
// })

// // Batch predict for multiple products
// router.post("/batch-predict", auth, async (req, res) => {
//   try {
//     const { limit = 50, category, status } = req.body

//     const query = {
//       storeId: req.user.storeId,
//       isActive: true,
//     }

//     if (category) query.category = category
//     if (status) query.status = status

//     const products = await Product.find(query).limit(limit)
//     const results = []
//     let alertsCreated = 0

//     for (const product of products) {
//       try {
//         const prediction = await predictor.predict(product)

//         if (prediction) {
//           product.predictions = {
//             ...prediction,
//             lastPredicted: new Date(),
//           }
//           await product.save()

//           results.push({
//             productId: product._id,
//             name: product.name,
//             prediction,
//           })

//           // Create alert if high risk
//           if (prediction.spoilageRisk > 70) {
//             await Alert.create({
//               title: "High Spoilage Risk Detected",
//               message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//               type: "spoilage",
//               severity: prediction.spoilageRisk > 90 ? "critical" : "high",
//               productId: product._id,
//               userId: req.user._id,
//               storeId: req.user.storeId,
//               metadata: {
//                 spoilageRisk: prediction.spoilageRisk,
//                 daysUntilSpoilage: prediction.daysLeft,
//               },
//             })
//             alertsCreated++
//           }
//         }
//       } catch (error) {
//         console.error(`Prediction failed for product ${product._id}:`, error)
//       }
//     }

//     res.json({
//       success: true,
//       message: `Processed ${results.length} products, created ${alertsCreated} alerts`,
//       data: {
//         results,
//         summary: {
//           processed: results.length,
//           alertsCreated,
//         },
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Batch prediction failed",
//       error: error.message,
//     })
//   }
// })

// // Get model information
// router.get("/model-info", auth, async (req, res) => {
//   try {
//     const info = predictor.getModelInfo()
//     res.json({
//       success: true,
//       data: { modelInfo: info },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get model info",
//       error: error.message,
//     })
//   }
// })

// module.exports = router


const express = require("express")
const Product = require("../models/Product")
const Alert = require("../models/Alert")
const { auth, authorize } = require("../middleware/auth")
// Update to use the FreshTrack predictor
const FreshTrackPredictor = require("../ml/freshtrack_predictor")

const router = express.Router()
const predictor = new FreshTrackPredictor()

// Predict spoilage using FreshTrack data
router.post("/predict/:productId", auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      storeId: req.user.storeId,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    const prediction = await predictor.predictWithFreshTrackData(product)

    if (prediction) {
      // Update product with FreshTrack prediction
      product.predictions = {
        ...prediction,
        lastPredicted: new Date(),
      }
      await product.save()

      // Create FreshTrack-enhanced alerts
      if (prediction.spoilageRisk > 70 && prediction.freshTrackNotifications?.length > 0) {
        const notification = prediction.freshTrackNotifications[0]

        await Alert.create({
          title: notification.title,
          message: notification.message,
          type: "spoilage",
          severity: notification.priority,
          productId: product._id,
          userId: req.user._id,
          storeId: req.user.storeId,
          metadata: {
            spoilageRisk: prediction.spoilageRisk,
            confidence: prediction.confidence,
            dataSource: prediction.data_source,
            freshTrackAnalysis: true,
            categorySensitivity: notification.freshTrackCategorySensitivity,
            urgencyLevel: prediction.urgencyLevel,
            businessImpact: prediction.business_impact,
            donationMatching: prediction.optimalDonationMatching,
            environmentalImpact: prediction.environmentalImpact,
            categoryInsights: prediction.categoryInsights,
            realTimeAlerts: prediction.realTimeAlerts,
            recommendedActions: notification.actions,
          },
        })
      }
    }

    res.json({
      success: true,
      message: "FreshTrack prediction completed",
      data: { prediction },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "FreshTrack prediction failed",
      error: error.message,
    })
  }
})

// Batch predict using FreshTrack data
router.post("/batch-predict", auth, async (req, res) => {
  try {
    const { limit = 50, category, status } = req.body

    const query = {
      storeId: req.user.storeId,
      isActive: true,
    }

    if (category) query.category = category
    if (status) query.status = status

    const products = await Product.find(query).limit(limit)
    const results = await predictor.batchPredictFreshTrack(products)
    let alertsCreated = 0
    let donationOpportunities = 0
    let criticalProducts = 0

    // Process FreshTrack results and create enhanced alerts
    for (const result of results) {
      if (result.spoilageRisk > 70 && result.freshTrackNotifications?.length > 0) {
        try {
          const product = products.find((p) => p._id.toString() === result.productId)
          if (product) {
            const notification = result.freshTrackNotifications[0]

            await Alert.create({
              title: notification.title,
              message: notification.message,
              type: "spoilage",
              severity: notification.priority,
              productId: product._id,
              userId: req.user._id,
              storeId: req.user.storeId,
              metadata: {
                spoilageRisk: result.spoilageRisk,
                confidence: result.confidence,
                dataSource: result.data_source,
                freshTrackBatchPrediction: true,
                categorySensitivity: notification.freshTrackCategorySensitivity,
                businessImpact: result.business_impact,
                donationMatching: result.optimalDonationMatching,
              },
            })
            alertsCreated++
          }
        } catch (alertError) {
          console.error("Error creating FreshTrack alert:", alertError)
        }
      }

      if (result.spoilageRisk >= 85) criticalProducts++
      if (result.optimalDonationMatching?.suitable) donationOpportunities++
    }

    res.json({
      success: true,
      message: `FreshTrack processed ${results.length} products, created ${alertsCreated} smart alerts`,
      data: {
        results,
        summary: {
          processed: results.length,
          alertsCreated,
          criticalProducts,
          donationOpportunities,
          dataSource: "freshtrack_excel_datasets",
          averageConfidence: (results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length).toFixed(1),
          totalPotentialLoss: results.reduce((sum, r) => sum + (r.business_impact?.potential_loss || 0), 0).toFixed(2),
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "FreshTrack batch prediction failed",
      error: error.message,
    })
  }
})

// Get FreshTrack model information
router.get("/model-info", auth, async (req, res) => {
  try {
    const info = predictor.getModelInfo()
    res.json({
      success: true,
      data: {
        modelInfo: info,
        freshTrackCapabilities: [
          "3000+ Product Dataset Analysis",
          "Category Sensitivity Modeling (Dairy:2x, Meat:4x, etc.)",
          "Environmental Factor Integration",
          "Smart Notification Generation",
          "Optimal Donation Matching",
          "Business Impact Analysis",
          "Real-time Alert System",
          "Excel Dataset Processing",
        ],
        datasetInfo: {
          source: "FreshTrack Excel Files",
          records: "3000+",
          categories: ["Dairy", "Bakery", "Produce", "Meat", "Frozen"],
          stores: 5,
          environmentalFactors: ["Temperature", "Humidity"],
          feedbackIntegration: true,
          donationTracking: true,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get FreshTrack model info",
      error: error.message,
    })
  }
})

// New route: Get FreshTrack data insights
router.get("/freshtrack-insights", auth, async (req, res) => {
  try {
    const freshTrackFiles = predictor.scanForFreshTrackFiles()
    const modelInfo = predictor.getModelInfo()

    res.json({
      success: true,
      data: {
        freshTrackFiles: freshTrackFiles,
        modelInfo: modelInfo,
        dataProcessingStatus: freshTrackFiles.length >= 4 ? "active" : "incomplete",
        lastTraining: modelInfo.trained_at,
        features: modelInfo.feature_columns?.length || 0,
        categorySensitivity: modelInfo.category_sensitivity,
        datasetSummary: {
          expectedFiles: [
            "FreshTrack_Inventory.xlsx",
            "FreshTrack_Environment.xlsx",
            "FreshTrack_SpoilageLog.xlsx",
            "FreshTrack_Feedback.xlsx",
            "FreshTrack_Donations.xlsx",
            "FreshTrack_ActionLog.xlsx",
          ],
          foundFiles: freshTrackFiles,
          completeness: `${freshTrackFiles.length}/6 files found`,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get FreshTrack insights",
      error: error.message,
    })
  }
})

module.exports = router
