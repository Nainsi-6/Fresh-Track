// const express = require('express')
// const Product = require('../models/Product')
// const Alert = require('../models/Alert')
// const { protect, checkPermission } = require('../middleware/auth')
// const router = express.Router()

// // @route   GET /api/products
// // @desc    Get all products with filtering and pagination
// // @access  Private
// router.get('/', protect, checkPermission('view_products'), async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       category,
//       status,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc',
//       storeId
//     } = req.query

//     // Build filter object
//     const filter = { isActive: true }
    
//     // Store filter - users can only see products from their store unless admin
//     if (req.user.role !== 'admin') {
//       filter.storeId = req.user.storeId
//     } else if (storeId) {
//       filter.storeId = storeId
//     }

//     if (category) filter.category = category
//     if (status) filter.status = status
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { batch: { $regex: search, $options: 'i' } },
//         { 'supplier.name': { $regex: search, $options: 'i' } }
//       ]
//     }

//     // Build sort object
//     const sort = {}
//     sort[sortBy] = sortOrder === 'desc' ? -1 : 1

//     // Execute query with pagination
//     const skip = (page - 1) * limit
//     const products = await Product.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate('feedback')

//     const total = await Product.countDocuments(filter)

//     // Calculate summary statistics
//     const stats = await Product.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalProducts: { $sum: 1 },
//           criticalCount: { $sum: { $cond: [{ $eq: ['$status', 'critical'] }, 1, 0] } },
//           warningCount: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } },
//           goodCount: { $sum: { $cond: [{ $eq: ['$status', 'good'] }, 1, 0] } },
//           expiredCount: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
//           totalValue: { $sum: { $multiply: ['$inventory.quantity', '$pricing.retail'] } },
//           avgSpoilageRisk: { $avg: '$predictions.spoilageRisk' }
//         }
//       }
//     ])

//     res.json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           current: parseInt(page),
//           pages: Math.ceil(total / limit),
//           total,
//           limit: parseInt(limit)
//         },
//         stats: stats[0] || {
//           totalProducts: 0,
//           criticalCount: 0,
//           warningCount: 0,
//           goodCount: 0,
//           expiredCount: 0,
//           totalValue: 0,
//           avgSpoilageRisk: 0
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Get products error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   GET /api/products/:id
// // @desc    Get single product
// // @access  Private
// router.get('/:id', protect, checkPermission('view_products'), async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       })
//     }

//     // Check if user can access this product
//     if (req.user.role !== 'admin' && product.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to access this product'
//       })
//     }

//     res.json({
//       success: true,
//       data: { product }
//     })
//   } catch (error) {
//     console.error('Get product error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/products
// // @desc    Create new product
// // @access  Private
// router.post('/', protect, checkPermission('edit_products'), async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       storeId: req.user.storeId
//     }

//     const product = await Product.create(productData)

//     res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       data: { product }
//     })
//   } catch (error) {
//     console.error('Create product error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during product creation',
//       error: error.message
//     })
//   }
// })

// // @route   PUT /api/products/:id
// // @desc    Update product
// // @access  Private
// router.put('/:id', protect, checkPermission('edit_products'), async (req, res) => {
//   try {
//     let product = await Product.findById(req.params.id)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       })
//     }

//     // Check if user can update this product
//     if (req.user.role !== 'admin' && product.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this product'
//       })
//     }

//     product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     )

//     res.json({
//       success: true,
//       message: 'Product updated successfully',
//       data: { product }
//     })
//   } catch (error) {
//     console.error('Update product error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during product update',
//       error: error.message
//     })
//   }
// })

// // @route   DELETE /api/products/:id
// // @desc    Delete product (soft delete)
// // @access  Private
// router.delete('/:id', protect, checkPermission('delete_products'), async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       })
//     }

//     // Check if user can delete this product
//     if (req.user.role !== 'admin' && product.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to delete this product'
//       })
//     }

//     // Soft delete
//     product.isActive = false
//     await product.save()

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     })
//   } catch (error) {
//     console.error('Delete product error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during product deletion',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/products/:id/discount
// // @desc    Apply discount to product
// // @access  Private
// router.post('/:id/discount', protect, checkPermission('edit_products'), async (req, res) => {
//   try {
//     const { percentage } = req.body
//     const product = await Product.findById(req.params.id)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       })
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && product.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to modify this product'
//       })
//     }

//     // Apply discount
//     product.pricing.discount.percentage = percentage
//     product.pricing.discount.applied = true
//     product.pricing.discount.appliedAt = new Date()
//     product.actions.discountApplied = true

//     await product.save()

//     res.json({
//       success: true,
//       message: 'Discount applied successfully',
//       data: { product }
//     })
//   } catch (error) {
//     console.error('Apply discount error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/products/:id/feedback
// // @desc    Add customer feedback
// // @access  Private
// router.post('/:id/feedback', protect, async (req, res) => {
//   try {
//     const { rating, comment, sentiment } = req.body
//     const product = await Product.findById(req.params.id)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       })
//     }

//     product.feedback.push({
//       rating,
//       comment,
//       sentiment: sentiment || 'neutral'
//     })

//     await product.save()

//     res.json({
//       success: true,
//       message: 'Feedback added successfully',
//       data: { product }
//     })
//   } catch (error) {
//     console.error('Add feedback error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
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

// // Get all products
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, status, sortBy = "createdAt", sortOrder = "desc", search } = req.query

//     const query = { storeId: req.user.storeId, isActive: true }

//     if (category) query.category = category
//     if (status) query.status = status
//     if (search) {
//       query.$or = [{ name: { $regex: search, $options: "i" } }, { batch: { $regex: search, $options: "i" } }]
//     }

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//       populate: "userId",
//     }

//     const products = await Product.find(query)
//       .populate("userId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Product.countDocuments(query)

//     res.json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch products",
//       error: error.message,
//     })
//   }
// })

// // Get single product
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     }).populate("userId", "name email")

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product",
//       error: error.message,
//     })
//   }
// })

// // Create product
// router.post("/", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       userId: req.user._id,
//       storeId: req.user.storeId,
//     }

//     const product = new Product(productData)
//     await product.save()

//     // Run ML prediction
//     try {
//       const prediction = await predictor.predict(product._id)
//       if (prediction) {
//         product.predictions = prediction
//         await product.save()

//         // Create alert if high risk
//         if (prediction.spoilageRisk > 70) {
//           await Alert.create({
//             title: "High Spoilage Risk Detected",
//             message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//             type: "spoilage",
//             severity: "high",
//             productId: product._id,
//             userId: req.user._id,
//             storeId: req.user.storeId,
//             metadata: {
//               spoilageRisk: prediction.spoilageRisk,
//               daysUntilSpoilage: prediction.daysUntilSpoilage,
//             },
//           })
//         }
//       }
//     } catch (mlError) {
//       console.error("ML prediction failed:", mlError)
//     }

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product",
//       error: error.message,
//     })
//   }
// })

// // Update product
// router.put("/:id", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate({ _id: req.params.id, storeId: req.user.storeId }, req.body, {
//       new: true,
//       runValidators: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update product",
//       error: error.message,
//     })
//   }
// })

// // Delete product
// router.delete("/:id", auth, authorize("manager"), async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       { isActive: false },
//       { new: true },
//     )

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete product",
//       error: error.message,
//     })
//   }
// })

// // Apply discount
// router.post("/:id/discount", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const { percentage } = req.body

//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     product.price.discountPercentage = percentage
//     product.price.current = product.price.original * (1 - percentage / 100)
//     await product.save()

//     res.json({
//       success: true,
//       message: "Discount applied successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to apply discount",
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

// // Get all products
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, status, sortBy = "createdAt", sortOrder = "desc", search } = req.query

//     const query = { storeId: req.user.storeId, isActive: true }

//     if (category) query.category = category
//     if (status) query.status = status
//     if (search) {
//       query.$or = [{ name: { $regex: search, $options: "i" } }, { batch: { $regex: search, $options: "i" } }]
//     }

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const products = await Product.find(query)
//       .populate("userId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Product.countDocuments(query)

//     res.json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch products",
//       error: error.message,
//     })
//   }
// })

// // Get single product
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     }).populate("userId", "name email")

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product",
//       error: error.message,
//     })
//   }
// })

// // Create product
// router.post("/", auth, async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       userId: req.user._id,
//       storeId: req.user.storeId,
//     }

//     const product = new Product(productData)
//     await product.save()

//     // Run ML prediction
//     try {
//       const prediction = await predictor.predict(product)
//       if (prediction) {
//         product.predictions = prediction
//         await product.save()

//         // Create alert if high risk
//         if (prediction.spoilageRisk > 70) {
//           await Alert.create({
//             title: "High Spoilage Risk Detected",
//             message: `Product ${product.name} has ${prediction.spoilageRisk}% spoilage risk`,
//             type: "spoilage",
//             severity: prediction.spoilageRisk > 90 ? "critical" : "high",
//             productId: product._id,
//             userId: req.user._id,
//             storeId: req.user.storeId,
//             metadata: {
//               spoilageRisk: prediction.spoilageRisk,
//               daysUntilSpoilage: prediction.daysLeft,
//             },
//           })
//         }
//       }
//     } catch (mlError) {
//       console.error("ML prediction failed:", mlError)
//     }

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product",
//       error: error.message,
//     })
//   }
// })

// // Update product
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate({ _id: req.params.id, storeId: req.user.storeId }, req.body, {
//       new: true,
//       runValidators: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update product",
//       error: error.message,
//     })
//   }
// })

// // Delete product
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       { isActive: false },
//       { new: true },
//     )

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete product",
//       error: error.message,
//     })
//   }
// })

// // Apply discount
// router.post("/:id/discount", auth, async (req, res) => {
//   try {
//     const { percentage } = req.body
//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     product.price.discountPercentage = percentage
//     product.price.current = product.price.original * (1 - percentage / 100)
//     await product.save()

//     res.json({
//       success: true,
//       message: "Discount applied successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to apply discount",
//       error: error.message,
//     })
//   }
// })

// module.exports = router


// const express = require("express")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")
// // Update to use the FreshTrack predictor
// const FreshTrackPredictor = require("../ml/freshtrack_predictor")

// const router = express.Router()
// const predictor = new FreshTrackPredictor()

// // Get all products
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, status, sortBy = "createdAt", sortOrder = "desc", search } = req.query

//     const query = { storeId: req.user.storeId, isActive: true }

//     if (category) query.category = category
//     if (status) query.status = status
//     if (search) {
//       query.$or = [{ name: { $regex: search, $options: "i" } }, { batch: { $regex: search, $options: "i" } }]
//     }

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const products = await Product.find(query)
//       .populate("userId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Product.countDocuments(query)

//     res.json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch products",
//       error: error.message,
//     })
//   }
// })

// // Create product with FreshTrack prediction
// router.post("/", auth, async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       userId: req.user._id,
//       storeId: req.user.storeId,
//     }

//     const product = new Product(productData)
//     await product.save()

//     // Run FreshTrack ML prediction
//     try {
//       const prediction = await predictor.predictWithFreshTrackData(product)
//       if (prediction) {
//         product.predictions = prediction
//         await product.save()

//         // Create FreshTrack-enhanced alerts
//         if (prediction.spoilageRisk > 70 && prediction.freshTrackNotifications?.length > 0) {
//           const notification = prediction.freshTrackNotifications[0]

//           const alertData = {
//             title: notification.title,
//             message: notification.message,
//             type: "spoilage",
//             severity: notification.priority,
//             productId: product._id,
//             userId: req.user._id,
//             storeId: req.user.storeId,
//             metadata: {
//               spoilageRisk: prediction.spoilageRisk,
//               confidence: prediction.confidence,
//               dataSource: prediction.data_source,
//               freshTrackCategorySensitivity: notification.freshTrackCategorySensitivity,
//               businessImpact: prediction.business_impact,
//               donationMatching: prediction.optimalDonationMatching,
//               environmentalImpact: prediction.environmentalImpact,
//               categoryInsights: prediction.categoryInsights,
//               recommendedActions: notification.actions,
//             },
//           }

//           await Alert.create(alertData)
//         }
//       }
//     } catch (mlError) {
//       console.error("FreshTrack ML prediction failed:", mlError)
//     }

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully with FreshTrack analysis",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product",
//       error: error.message,
//     })
//   }
// })

// // Other routes remain the same...
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     }).populate("userId", "name email")

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product",
//       error: error.message,
//     })
//   }
// })

// router.put("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate({ _id: req.params.id, storeId: req.user.storeId }, req.body, {
//       new: true,
//       runValidators: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update product",
//       error: error.message,
//     })
//   }
// })

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       { isActive: false },
//       { new: true },
//     )

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete product",
//       error: error.message,
//     })
//   }
// })

// router.post("/:id/discount", auth, async (req, res) => {
//   try {
//     const { percentage } = req.body
//     const product = await Product.findOne({
//       _id: req.params.id,
//       storeId: req.user.storeId,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     product.price.discountPercentage = percentage
//     product.price.current = product.price.original * (1 - percentage / 100)
//     await product.save()

//     res.json({
//       success: true,
//       message: "Discount applied successfully",
//       data: { product },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to apply discount",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

const express = require("express")
const { auth } = require("../middleware/auth")
const excelDataService = require("../services/excelDataService")
const FreshTrackPredictor = require("../ml/freshtrack_predictor")

const router = express.Router()
const predictor = new FreshTrackPredictor()

// Get all products from Excel data
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      sortBy = "predictions.spoilageRisk",
      sortOrder = "desc",
      search,
    } = req.query

    // Get enriched data from Excel files
    let products = excelDataService.getEnrichedInventoryData()

    // Apply filters
    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (status) {
      products = products.filter((p) => p.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.product_id.toLowerCase().includes(searchLower) ||
          p.batch_id.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower),
      )
    }

    // Sort products
    products.sort((a, b) => {
      let aVal = a
      let bVal = b

      // Navigate nested properties
      const sortPath = sortBy.split(".")
      for (const key of sortPath) {
        aVal = aVal?.[key]
        bVal = bVal?.[key]
      }

      if (sortOrder === "desc") {
        return (bVal || 0) - (aVal || 0)
      } else {
        return (aVal || 0) - (bVal || 0)
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedProducts = products.slice(startIndex, endIndex)

    // Transform to match frontend expectations
    const transformedProducts = paginatedProducts.map((product) => ({
      _id: product.product_id,
      name: `${product.category} Product ${product.product_id}`,
      category: product.category,
      batch: product.batch_id,
      quantity: product.current_stock,
      unit: "units",
      price: {
        current: 5.99, // Default price
        original: 5.99,
        discountPercentage: 0,
      },
      dates: {
        received: product.arrival_date,
        manufactured: product.arrival_date,
        expiry: product.expiry_date,
      },
      storage: {
        temperature: product.environment.temperature,
        humidity: product.environment.humidity,
        location: `Store ${product.store_id}`,
      },
      supplier: {
        name: `Supplier for ${product.category}`,
      },
      predictions: product.predictions,
      feedback: product.feedback,
      status: product.status,
      isActive: true,
      storeId: product.store_id,
      createdAt: product.arrival_date,
    }))

    res.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(products.length / limit),
          total: products.length,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products from Excel data",
      error: error.message,
    })
  }
})

// Get single product by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const products = excelDataService.getEnrichedInventoryData()
    const product = products.find((p) => p.product_id === req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in Excel data",
      })
    }

    // Transform to match frontend expectations
    const transformedProduct = {
      _id: product.product_id,
      name: `${product.category} Product ${product.product_id}`,
      category: product.category,
      batch: product.batch_id,
      quantity: product.current_stock,
      unit: "units",
      price: {
        current: 5.99,
        original: 5.99,
        discountPercentage: 0,
      },
      dates: {
        received: product.arrival_date,
        manufactured: product.arrival_date,
        expiry: product.expiry_date,
      },
      storage: {
        temperature: product.environment.temperature,
        humidity: product.environment.humidity,
        location: `Store ${product.store_id}`,
      },
      supplier: {
        name: `Supplier for ${product.category}`,
      },
      predictions: product.predictions,
      feedback: product.feedback,
      status: product.status,
      isActive: true,
      storeId: product.store_id,
    }

    res.json({
      success: true,
      data: { product: transformedProduct },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    })
  }
})

// Apply discount to product
router.post("/:id/discount", auth, async (req, res) => {
  try {
    const { percentage } = req.body

    // In a real implementation, you would update the Excel file or database
    // For now, we'll simulate the response

    res.json({
      success: true,
      message: `Applied ${percentage}% discount successfully`,
      data: {
        discountApplied: percentage,
        newPrice: (5.99 * (1 - percentage / 100)).toFixed(2),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to apply discount",
      error: error.message,
    })
  }
})

// Get product statistics
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const products = excelDataService.getEnrichedInventoryData()

    const stats = {
      total: products.length,
      critical: products.filter((p) => p.predictions.spoilageRisk >= 85).length,
      warning: products.filter((p) => p.predictions.spoilageRisk >= 70 && p.predictions.spoilageRisk < 85).length,
      caution: products.filter((p) => p.predictions.spoilageRisk >= 50 && p.predictions.spoilageRisk < 70).length,
      fresh: products.filter((p) => p.predictions.spoilageRisk < 50).length,
      categories: [...new Set(products.map((p) => p.category))],
      avgSpoilageRisk: Math.round(products.reduce((sum, p) => sum + p.predictions.spoilageRisk, 0) / products.length),
      totalValue: Math.round(products.reduce((sum, p) => sum + p.totalValue, 0)),
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product statistics",
      error: error.message,
    })
  }
})

// Create new product (for sample product creation)
router.post("/", auth, async (req, res) => {
  try {
    const productData = req.body

    // Generate a unique product ID
    const productId = `P${Date.now()}`

    // Create a mock product entry (in real app, this would be saved to database/Excel)
    const newProduct = {
      _id: productId,
      product_id: productId,
      name: productData.name || "Sample Product",
      category: productData.category || "dairy",
      batch: productData.batch || `BATCH-${Date.now()}`,
      quantity: productData.quantity || 10,
      unit: productData.unit || "units",
      price: productData.price || {
        current: 5.99,
        original: 5.99,
        discountPercentage: 0,
      },
      dates: {
        received: productData.dates?.received || new Date().toISOString(),
        manufactured: productData.dates?.manufactured || new Date().toISOString(),
        expiry: productData.dates?.expiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      storage: productData.storage || {
        temperature: 4,
        humidity: 65,
        location: "Main Storage",
      },
      supplier: productData.supplier || {
        name: "Sample Supplier",
        contact: "+1-555-0123",
      },
      predictions: {
        spoilageRisk: Math.floor(Math.random() * 100),
        daysToExpiry: Math.ceil(
          (new Date(productData.dates?.expiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
        urgencyLevel: "LOW",
        lastPredicted: new Date().toISOString(),
        confidence: 85,
      },
      feedback: {
        avgRating: 4.2,
        freshnessScore: 0.8,
        reviewCount: 5,
      },
      status: "fresh",
      isActive: true,
      storeId: req.user?.storeId || "store_1",
      createdAt: new Date().toISOString(),
    }

    // In a real implementation, you would save this to database/Excel file
    console.log("Sample product created:", newProduct)

    res.status(201).json({
      success: true,
      message: "Sample product created successfully",
      data: { product: newProduct },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create sample product",
      error: error.message,
    })
  }
})

module.exports = router
