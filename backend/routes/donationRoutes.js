// const express = require('express')
// const Donation = require('../models/Donation')
// const Product = require('../models/Product')
// const NGO = require('../models/NGO')
// const { protect, checkPermission } = require('../middleware/auth')
// const router = express.Router()

// // @route   GET /api/donations
// // @desc    Get all donations with filtering
// // @access  Private
// router.get('/', protect, checkPermission('manage_donations'), async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       startDate,
//       endDate,
//       ngoId
//     } = req.query

//     // Build filter
//     const filter = {}
    
//     // Store filter
//     if (req.user.role !== 'admin') {
//       filter.storeId = req.user.storeId
//     }

//     if (status) filter.status = status
//     if (ngoId) filter['ngo.ngoId'] = ngoId
    
//     if (startDate || endDate) {
//       filter.createdAt = {}
//       if (startDate) filter.createdAt.$gte = new Date(startDate)
//       if (endDate) filter.createdAt.$lte = new Date(endDate)
//     }

//     const skip = (page - 1) * limit
//     const donations = await Donation.find(filter)
//       .populate('products.productId', 'name category batch')
//       .populate('ngo.ngoId', 'name contact')
//       .populate('createdBy', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))

//     const total = await Donation.countDocuments(filter)

//     // Calculate statistics
//     const stats = await Donation.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalDonations: { $sum: 1 },
//           totalValue: { $sum: '$totalValue' },
//           totalQuantity: { $sum: '$totalQuantity' },
//           scheduledCount: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
//           completedCount: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } }
//         }
//       }
//     ])

//     res.json({
//       success: true,
//       data: {
//         donations,
//         pagination: {
//           current: parseInt(page),
//           pages: Math.ceil(total / limit),
//           total,
//           limit: parseInt(limit)
//         },
//         stats: stats[0] || {
//           totalDonations: 0,
//           totalValue: 0,
//           totalQuantity: 0,
//           scheduledCount: 0,
//           completedCount: 0
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Get donations error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/donations
// // @desc    Create new donation
// // @access  Private
// router.post('/', protect, checkPermission('manage_donations'), async (req, res) => {
//   try {
//     const { products, ngoId, pickupDate, pickupAddress, notes } = req.body

//     // Validate NGO
//     const ngo = await NGO.findById(ngoId)
//     if (!ngo || !ngo.isActive) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or inactive NGO'
//       })
//     }

//     // Validate and prepare products
//     const donationProducts = []
//     let totalValue = 0
//     let totalQuantity = 0

//     for (const item of products) {
//       const product = await Product.findById(item.productId)
//       if (!product || !product.isActive) {
//         return res.status(400).json({
//           success: false,
//           message: `Product ${item.productId} not found or inactive`
//         })
//       }

//       if (product.availableQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for product ${product.name}`
//         })
//       }

//       const estimatedValue = product.pricing.retail * item.quantity
//       donationProducts.push({
//         productId: product._id,
//         quantity: item.quantity,
//         estimatedValue
//       })

//       totalValue += estimatedValue
//       totalQuantity += item.quantity

//       // Reserve the quantity
//       product.inventory.reserved += item.quantity
//       await product.save()
//     }

//     // Create donation
//     const donation = await Donation.create({
//       products: donationProducts,
//       ngo: {
//         ngoId: ngo._id,
//         name: ngo.name,
//         contact: ngo.contact.primary
//       },
//       pickup: {
//         scheduled: new Date(pickupDate),
//         address: pickupAddress
//       },
//       totalValue,
//       totalQuantity,
//       storeId: req.user.storeId,
//       createdBy: req.user.id,
//       notes
//     })

//     await donation.populate('products.productId', 'name category batch')

//     res.status(201).json({
//       success: true,
//       message: 'Donation created successfully',
//       data: { donation }
//     })
//   } catch (error) {
//     console.error('Create donation error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during donation creation',
//       error: error.message
//     })
//   }
// })

// // @route   PUT /api/donations/:id/status
// // @desc    Update donation status
// // @access  Private
// router.put('/:id/status', protect, checkPermission('manage_donations'), async (req, res) => {
//   try {
//     const { status } = req.body
//     const donation = await Donation.findById(req.params.id)

//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Donation not found'
//       })
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && donation.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this donation'
//       })
//     }

//     const oldStatus = donation.status
//     donation.status = status

//     // Handle status-specific logic
//     if (status === 'picked_up' && oldStatus !== 'picked_up') {
//       donation.pickup.actual = new Date()
      
//       // Update product quantities
//       for (const item of donation.products) {
//         const product = await Product.findById(item.productId)
//         if (product) {
//           product.inventory.quantity -= item.quantity
//           product.inventory.reserved -= item.quantity
//           product.status = 'donated'
//           await product.save()
//         }
//       }
//     }

//     if (status === 'cancelled') {
//       // Release reserved quantities
//       for (const item of donation.products) {
//         const product = await Product.findById(item.productId)
//         if (product) {
//           product.inventory.reserved -= item.quantity
//           await product.save()
//         }
//       }
//     }

//     await donation.save()

//     res.json({
//       success: true,
//       message: 'Donation status updated successfully',
//       data: { donation }
//     })
//   } catch (error) {
//     console.error('Update donation status error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   GET /api/donations/ngos
// // @desc    Get available NGOs for donations
// // @access  Private
// router.get('/ngos', protect, checkPermission('manage_donations'), async (req, res) => {
//   try {
//     const { category, maxDistance = 50 } = req.query

//     const filter = {
//       isActive: true,
//       'verification.status': 'verified'
//     }

//     if (category) {
//       filter['preferences.acceptedCategories'] = category
//     }

//     const ngos = await NGO.find(filter)
//       .select('name type contact address capacity preferences statistics')
//       .sort({ 'statistics.averageRating': -1 })

//     res.json({
//       success: true,
//       data: { ngos }
//     })
//   } catch (error) {
//     console.error('Get NGOs error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// module.exports = router


// const express = require("express")
// const Donation = require("../models/Donation")
// const NGO = require("../models/NGO")
// const Product = require("../models/Product")
// const { auth, authorize } = require("../middleware/auth")

// const router = express.Router()

// // Get all donations
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, sortBy = "createdAt", sortOrder = "desc" } = req.query

//     const query = { storeId: req.user.storeId }
//     if (status) query.status = status

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const donations = await Donation.find(query)
//       .populate("productId", "name category batch quantity")
//       .populate("ngoId", "name email phone")
//       .populate("donorId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Donation.countDocuments(query)

//     res.json({
//       success: true,
//       data: {
//         donations,
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
//       message: "Failed to fetch donations",
//       error: error.message,
//     })
//   }
// })

// // Create donation
// router.post("/", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const { productId, ngoId, quantity, notes } = req.body

//     // Verify product exists and belongs to user's store
//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Verify NGO exists and can accept this category
//     const ngo = await NGO.findOne({
//       _id: ngoId,
//       isActive: true,
//       acceptedCategories: product.category,
//     })

//     if (!ngo) {
//       return res.status(404).json({
//         success: false,
//         message: "NGO not found or cannot accept this product category",
//       })
//     }

//     // Check if quantity is available
//     if (quantity > product.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient quantity available",
//       })
//     }

//     // Calculate donation value
//     const value = product.price.current * quantity

//     const donation = new Donation({
//       productId,
//       ngoId,
//       donorId: req.user._id,
//       quantity,
//       notes,
//       value,
//       storeId: req.user.storeId,
//     })

//     await donation.save()

//     // Update product quantity
//     product.quantity -= quantity
//     await product.save()

//     // Update NGO stats
//     ngo.totalDonationsReceived += 1
//     ngo.lastDonationDate = new Date()
//     await ngo.save()

//     res.status(201).json({
//       success: true,
//       message: "Donation created successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create donation",
//       error: error.message,
//     })
//   }
// })

// // Update donation status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { status } = req.body

//     const donation = await Donation.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       { status },
//       { new: true },
//     ).populate("productId ngoId donorId")

//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: "Donation not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Donation status updated successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update donation status",
//       error: error.message,
//     })
//   }
// })

// // Get available NGOs
// router.get("/ngos", auth, async (req, res) => {
//   try {
//     const { category } = req.query

//     const query = { isActive: true }
//     if (category) {
//       query.acceptedCategories = category
//     }

//     const ngos = await NGO.find(query)
//       .select("name email phone address acceptedCategories rating")
//       .sort({ "rating.average": -1 })

//     res.json({
//       success: true,
//       data: { ngos },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch NGOs",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

// const express = require("express")
// const Donation = require("../models/Donation")
// const NGO = require("../models/NGO")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")

// const router = express.Router()

// // Get all donations with FreshTrack insights
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, sortBy = "createdAt", sortOrder = "desc" } = req.query
//     const query = { storeId: req.user.storeId }

//     if (status) query.status = status

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const donations = await Donation.find(query)
//       .populate("productId", "name category batch quantity predictions")
//       .populate("ngoId", "name email phone")
//       .populate("donorId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Donation.countDocuments(query)

//     // Get donation statistics
//     const donationStats = await Donation.aggregate([
//       { $match: { storeId: req.user.storeId } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalValue: { $sum: "$value" },
//           totalQuantity: { $sum: "$quantity" },
//         },
//       },
//     ])

//     res.json({
//       success: true,
//       data: {
//         donations,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//         statistics: donationStats,
//       },
//     })
//   } catch (error) {
//     console.error("Get donations error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donations",
//       error: error.message,
//     })
//   }
// })

// // Get donation opportunities (products suitable for donation) - ALL CATEGORIES
// router.get("/opportunities", auth, async (req, res) => {
//   try {
//     // Get products from ALL categories with spoilage risk between 50-90%
//     const opportunities = await Product.find({
//       storeId: req.user.storeId,
//       isActive: true,
//       quantity: { $gt: 0 },
//       $or: [
//         { "predictions.spoilageRisk": { $gte: 50, $lte: 90 } },
//         { "dates.expiry": { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }, // Expires within 3 days
//       ],
//     })
//       .populate("userId", "name")
//       .sort({ "predictions.spoilageRisk": -1 })
//       .limit(50) // Increased limit to show more items

//     // Enhance with donation insights for ALL categories
//     const enhancedOpportunities = opportunities.map((product) => {
//       const risk = product.predictions?.spoilageRisk || calculateRiskFromExpiry(product.dates?.expiry)
//       const quantity = product.quantity
//       const value = product.price?.current || product.price || 0

//       return {
//         ...product.toObject(),
//         donationInsights: {
//           urgency: risk > 80 ? "High" : risk > 70 ? "Medium" : "Low",
//           estimatedMeals: Math.round(quantity * getCategoryMealFactor(product.category)),
//           taxBenefit: (value * quantity * 0.18).toFixed(2),
//           environmentalImpact: {
//             co2Saved: `${(quantity * getCO2Factor(product.category)).toFixed(1)} kg`,
//             waterSaved: `${quantity * getWaterFactor(product.category)} liters`,
//           },
//           optimalPickupWindow: getOptimalPickupWindow(risk),
//         },
//       }
//     })

//     res.json({
//       success: true,
//       data: {
//         opportunities: enhancedOpportunities,
//         summary: {
//           totalOpportunities: enhancedOpportunities.length,
//           totalValue: enhancedOpportunities.reduce(
//             (sum, p) => sum + (p.price?.current || p.price || 0) * p.quantity,
//             0,
//           ),
//           totalMeals: enhancedOpportunities.reduce((sum, p) => sum + p.donationInsights.estimatedMeals, 0),
//           categoryBreakdown: getCategoryBreakdown(enhancedOpportunities),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Get opportunities error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donation opportunities",
//       error: error.message,
//     })
//   }
// })

// // Get available NGOs with FreshTrack compatibility
// router.get("/ngos", auth, async (req, res) => {
//   try {
//     const { category } = req.query
//     const query = { isActive: true }

//     if (category) {
//       query.acceptedCategories = { $in: [category.toLowerCase()] }
//     }

//     let ngos = await NGO.find(query)
//       .select("name email phone address acceptedCategories rating totalDonationsReceived lastDonationDate")
//       .sort({ "rating.average": -1 })

//     // If no NGOs exist, create comprehensive default FreshTrack partners for ALL categories
//     if (ngos.length === 0) {
//       const defaultNGOs = [
//         {
//           name: "FreshTrack Partner Food Bank",
//           email: "donations@freshtrackpartner.org",
//           phone: "+1-555-FRESH-1",
//           address: "123 Community Drive, Food District",
//           acceptedCategories: ["dairy", "bakery", "produce", "meat", "frozen", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.8, count: 150 },
//           totalDonationsReceived: 245,
//           lastDonationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Community Kitchen Network",
//           email: "help@communitykitchen.org",
//           phone: "+1-555-FRESH-2",
//           address: "456 Helper Street, Care District",
//           acceptedCategories: ["bakery", "produce", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.6, count: 89 },
//           totalDonationsReceived: 156,
//           lastDonationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Homeless Shelter Alliance",
//           email: "intake@shelteralliance.org",
//           phone: "+1-555-FRESH-3",
//           address: "789 Support Avenue, Hope District",
//           acceptedCategories: ["dairy", "meat", "produce", "frozen", "pantry"],
//           isActive: true,
//           rating: { average: 4.9, count: 203 },
//           totalDonationsReceived: 312,
//           lastDonationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Local Food Rescue",
//           email: "rescue@localfoodrescue.org",
//           phone: "+1-555-FRESH-4",
//           address: "321 Rescue Road, Help District",
//           acceptedCategories: ["produce", "bakery", "dairy", "beverages"],
//           isActive: true,
//           rating: { average: 4.7, count: 124 },
//           totalDonationsReceived: 189,
//           lastDonationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
//         },
//       ]

//       ngos = await NGO.insertMany(defaultNGOs)
//     }

//     // Add FreshTrack compatibility scores
//     const enhancedNGOs = ngos.map((ngo) => ({
//       ...ngo.toObject(),
//       freshTrackScore: calculateNGOScore(ngo, category),
//       distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
//       capacity: ngo.totalDonationsReceived > 200 ? "High" : ngo.totalDonationsReceived > 100 ? "Medium" : "Low",
//     }))

//     res.json({
//       success: true,
//       data: { ngos: enhancedNGOs },
//     })
//   } catch (error) {
//     console.error("Get NGOs error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch NGOs",
//       error: error.message,
//     })
//   }
// })

// // Create donation with FreshTrack optimization
// router.post("/", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const { productId, ngoId, quantity, notes } = req.body

//     // Verify product exists and belongs to user's store
//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find or create default NGO if none provided
//     let ngo
//     if (ngoId) {
//       ngo = await NGO.findOne({ _id: ngoId, isActive: true })
//     } else {
//       ngo = await findBestNGOMatch(product)
//     }

//     if (!ngo) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Check if quantity is available
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))
//     if (donationQuantity > product.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient quantity available",
//       })
//     }

//     // Calculate donation value and impact
//     const value = (product.price?.current || product.price || 0) * donationQuantity
//     const estimatedMeals = donationQuantity * getCategoryMealFactor(product.category)
//     const co2Saved = donationQuantity * getCO2Factor(product.category)
//     const taxBenefit = value * 0.18

//     const donation = new Donation({
//       productId,
//       ngoId: ngo._id,
//       donorId: req.user._id,
//       quantity: donationQuantity,
//       notes: notes || `FreshTrack optimized donation for ${product.category}`,
//       value,
//       storeId: req.user.storeId,
//       freshTrackData: {
//         spoilageRisk: product.predictions?.spoilageRisk || 0,
//         estimatedMeals,
//         environmentalImpact: {
//           co2Saved: `${co2Saved.toFixed(1)} kg`,
//           waterSaved: `${donationQuantity * getWaterFactor(product.category)} liters`,
//         },
//         taxBenefit: taxBenefit.toFixed(2),
//       },
//     })

//     await donation.save()

//     // Update product quantity
//     product.quantity -= donationQuantity
//     if (product.quantity === 0) {
//       product.isActive = false
//     }
//     await product.save()

//     res.status(201).json({
//       success: true,
//       message: "Donation created successfully with FreshTrack optimization",
//       data: {
//         donation: await donation.populate("productId ngoId donorId"),
//         impact: {
//           estimatedMeals,
//           environmentalImpact: donation.freshTrackData.environmentalImpact,
//           taxBenefit: `$${taxBenefit.toFixed(2)}`,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Create donation error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create donation",
//       error: error.message,
//     })
//   }
// })

// // Quick donate endpoint for high-risk products
// router.post("/quick-donate/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params
//     const { quantity } = req.body

//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find best NGO match
//     const bestNGO = await findBestNGOMatch(product)

//     if (!bestNGO) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Create donation with optimal quantity
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))

//     // Use the main donation creation logic
//     req.body = {
//       productId,
//       ngoId: bestNGO._id,
//       quantity: donationQuantity,
//       notes: `FreshTrack quick donation - ${product.category} category`,
//     }

//     // Call the main POST handler
//     return router.handle(req, res)
//   } catch (error) {
//     console.error("Quick donate error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create quick donation",
//       error: error.message,
//     })
//   }
// })

// // Update donation status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { status } = req.body
//     const donation = await Donation.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       {
//         status,
//         updatedAt: new Date(),
//         ...(status === "collected" && { collectedAt: new Date() }),
//         ...(status === "delivered" && { deliveredAt: new Date() }),
//       },
//       { new: true },
//     ).populate("productId ngoId donorId")

//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: "Donation not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Donation status updated successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     console.error("Update donation status error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to update donation status",
//       error: error.message,
//     })
//   }
// })

// // Helper functions for ALL categories
// function getCategoryMealFactor(category) {
//   const factors = {
//     dairy: 2.5,
//     meat: 4.0,
//     produce: 2.0,
//     bakery: 3.0,
//     frozen: 3.5,
//     pantry: 2.8,
//     beverages: 1.5,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getCO2Factor(category) {
//   const factors = {
//     dairy: 3.2,
//     meat: 27.0,
//     produce: 2.0,
//     bakery: 1.8,
//     frozen: 4.5,
//     pantry: 1.2,
//     beverages: 0.8,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getWaterFactor(category) {
//   const factors = {
//     dairy: 45,
//     meat: 120,
//     produce: 25,
//     bakery: 35,
//     frozen: 50,
//     pantry: 20,
//     beverages: 15,
//   }
//   return factors[category?.toLowerCase()] || 30
// }

// function calculateRiskFromExpiry(expiryDate) {
//   if (!expiryDate) return 50
//   const now = new Date()
//   const expiry = new Date(expiryDate)
//   const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24)

//   if (daysUntilExpiry <= 1) return 90
//   if (daysUntilExpiry <= 2) return 80
//   if (daysUntilExpiry <= 3) return 70
//   if (daysUntilExpiry <= 5) return 60
//   return 50
// }

// function getCategoryBreakdown(opportunities) {
//   const breakdown = {}
//   opportunities.forEach((item) => {
//     const category = item.category || "other"
//     if (!breakdown[category]) {
//       breakdown[category] = { count: 0, value: 0 }
//     }
//     breakdown[category].count++
//     breakdown[category].value += (item.price?.current || item.price || 0) * item.quantity
//   })
//   return breakdown
// }

// function calculateNGOScore(ngo, category) {
//   let score = ngo.rating?.average || 4.0

//   if (category && ngo.acceptedCategories.includes(category.toLowerCase())) {
//     score += 0.5
//   }

//   if (ngo.lastDonationDate && Date.now() - new Date(ngo.lastDonationDate).getTime() < 7 * 24 * 60 * 60 * 1000) {
//     score += 0.3
//   }

//   if (ngo.totalDonationsReceived > 200) {
//     score += 0.2
//   }

//   return Math.min(5.0, score).toFixed(1)
// }

// function getOptimalPickupWindow(spoilageRisk) {
//   if (spoilageRisk >= 85) return "1-3 hours"
//   if (spoilageRisk >= 75) return "3-6 hours"
//   if (spoilageRisk >= 65) return "6-12 hours"
//   return "12-24 hours"
// }

// async function findBestNGOMatch(product) {
//   try {
//     const ngos = await NGO.find({
//       isActive: true,
//       acceptedCategories: { $in: [product.category?.toLowerCase()] },
//     }).sort({ "rating.average": -1 })

//     return ngos[0] || null
//   } catch (error) {
//     console.error("Find NGO match error:", error)
//     return null
//   }
// }

// module.exports = router

// const express = require("express")
// const Donation = require("../models/Donation")
// const NGO = require("../models/NGO")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")

// const router = express.Router()

// // Get all donations with FreshTrack insights
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, sortBy = "createdAt", sortOrder = "desc" } = req.query
//     const query = { storeId: req.user.storeId }

//     if (status) query.status = status

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const donations = await Donation.find(query)
//       .populate("productId", "name category batch quantity predictions")
//       .populate("ngoId", "name email phone")
//       .populate("donorId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Donation.countDocuments(query)

//     // Get donation statistics
//     const donationStats = await Donation.aggregate([
//       { $match: { storeId: req.user.storeId } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalValue: { $sum: "$value" },
//           totalQuantity: { $sum: "$quantity" },
//         },
//       },
//     ])

//     res.json({
//       success: true,
//       data: {
//         donations,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//         statistics: donationStats,
//       },
//     })
//   } catch (error) {
//     console.error("Get donations error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donations",
//       error: error.message,
//     })
//   }
// })

// // Get donation opportunities (products suitable for donation) - ALL CATEGORIES
// router.get("/opportunities", auth, async (req, res) => {
//   try {
//     // Get products from ALL categories with spoilage risk between 50-90%
//     const opportunities = await Product.find({
//       storeId: req.user.storeId,
//       isActive: true,
//       quantity: { $gt: 0 },
//       $or: [
//         { "predictions.spoilageRisk": { $gte: 50, $lte: 90 } },
//         { "dates.expiry": { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }, // Expires within 3 days
//       ],
//     })
//       .populate("userId", "name")
//       .sort({ "predictions.spoilageRisk": -1 })
//       .limit(50) // Increased limit to show more items

//     // Enhance with donation insights for ALL categories
//     const enhancedOpportunities = opportunities.map((product) => {
//       const risk = product.predictions?.spoilageRisk || calculateRiskFromExpiry(product.dates?.expiry)
//       const quantity = product.quantity
//       const value = product.price?.current || product.price || 0

//       return {
//         ...product.toObject(),
//         donationInsights: {
//           urgency: risk > 80 ? "High" : risk > 70 ? "Medium" : "Low",
//           estimatedMeals: Math.round(quantity * getCategoryMealFactor(product.category)),
//           taxBenefit: (value * quantity * 0.18).toFixed(2),
//           environmentalImpact: {
//             co2Saved: `${(quantity * getCO2Factor(product.category)).toFixed(1)} kg`,
//             waterSaved: `${quantity * getWaterFactor(product.category)} liters`,
//           },
//           optimalPickupWindow: getOptimalPickupWindow(risk),
//         },
//       }
//     })

//     res.json({
//       success: true,
//       data: {
//         opportunities: enhancedOpportunities,
//         summary: {
//           totalOpportunities: enhancedOpportunities.length,
//           totalValue: enhancedOpportunities.reduce(
//             (sum, p) => sum + (p.price?.current || p.price || 0) * p.quantity,
//             0,
//           ),
//           totalMeals: enhancedOpportunities.reduce((sum, p) => sum + p.donationInsights.estimatedMeals, 0),
//           categoryBreakdown: getCategoryBreakdown(enhancedOpportunities),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Get opportunities error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donation opportunities",
//       error: error.message,
//     })
//   }
// })

// // Get available NGOs with FreshTrack compatibility
// router.get("/ngos", auth, async (req, res) => {
//   try {
//     const { category } = req.query
//     const query = { isActive: true }

//     if (category) {
//       query.acceptedCategories = { $in: [category.toLowerCase()] }
//     }

//     let ngos = await NGO.find(query)
//       .select("name email phone address acceptedCategories rating totalDonationsReceived lastDonationDate")
//       .sort({ "rating.average": -1 })

//     // If no NGOs exist, create comprehensive default FreshTrack partners for ALL categories
//     if (ngos.length === 0) {
//       const defaultNGOs = [
//         {
//           name: "FreshTrack Partner Food Bank",
//           email: "donations@freshtrackpartner.org",
//           phone: "+1-555-FRESH-1",
//           address: "123 Community Drive, Food District",
//           acceptedCategories: ["dairy", "bakery", "produce", "meat", "frozen", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.8, count: 150 },
//           totalDonationsReceived: 245,
//           lastDonationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Community Kitchen Network",
//           email: "help@communitykitchen.org",
//           phone: "+1-555-FRESH-2",
//           address: "456 Helper Street, Care District",
//           acceptedCategories: ["bakery", "produce", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.6, count: 89 },
//           totalDonationsReceived: 156,
//           lastDonationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Homeless Shelter Alliance",
//           email: "intake@shelteralliance.org",
//           phone: "+1-555-FRESH-3",
//           address: "789 Support Avenue, Hope District",
//           acceptedCategories: ["dairy", "meat", "produce", "frozen", "pantry"],
//           isActive: true,
//           rating: { average: 4.9, count: 203 },
//           totalDonationsReceived: 312,
//           lastDonationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//         },
//         {
//           name: "Local Food Rescue",
//           email: "rescue@localfoodrescue.org",
//           phone: "+1-555-FRESH-4",
//           address: "321 Rescue Road, Help District",
//           acceptedCategories: ["produce", "bakery", "dairy", "beverages"],
//           isActive: true,
//           rating: { average: 4.7, count: 124 },
//           totalDonationsReceived: 189,
//           lastDonationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
//         },
//       ]

//       ngos = await NGO.insertMany(defaultNGOs)
//     }

//     // Add FreshTrack compatibility scores
//     const enhancedNGOs = ngos.map((ngo) => ({
//       ...ngo.toObject(),
//       freshTrackScore: calculateNGOScore(ngo, category),
//       distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
//       capacity: ngo.totalDonationsReceived > 200 ? "High" : ngo.totalDonationsReceived > 100 ? "Medium" : "Low",
//     }))

//     res.json({
//       success: true,
//       data: { ngos: enhancedNGOs },
//     })
//   } catch (error) {
//     console.error("Get NGOs error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch NGOs",
//       error: error.message,
//     })
//   }
// })

// // Create donation with FreshTrack optimization
// router.post("/", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const { productId, ngoId, quantity, notes } = req.body

//     // Verify product exists and belongs to user's store
//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find or create default NGO if none provided
//     let ngo
//     if (ngoId) {
//       ngo = await NGO.findOne({ _id: ngoId, isActive: true })
//     } else {
//       ngo = await findBestNGOMatch(product)
//     }

//     if (!ngo) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Check if quantity is available
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))
//     if (donationQuantity > product.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient quantity available",
//       })
//     }

//     // Calculate donation value and impact
//     const value = (product.price?.current || product.price || 0) * donationQuantity
//     const estimatedMeals = donationQuantity * getCategoryMealFactor(product.category)
//     const co2Saved = donationQuantity * getCO2Factor(product.category)
//     const taxBenefit = value * 0.18

//     const donation = new Donation({
//       productId,
//       ngoId: ngo._id,
//       donorId: req.user._id,
//       quantity: donationQuantity,
//       notes: notes || `FreshTrack optimized donation for ${product.category}`,
//       value,
//       storeId: req.user.storeId,
//       freshTrackData: {
//         spoilageRisk: product.predictions?.spoilageRisk || 0,
//         estimatedMeals,
//         environmentalImpact: {
//           co2Saved: `${co2Saved.toFixed(1)} kg`,
//           waterSaved: `${donationQuantity * getWaterFactor(product.category)} liters`,
//         },
//         taxBenefit: taxBenefit.toFixed(2),
//       },
//     })

//     await donation.save()

//     // Update product quantity
//     product.quantity -= donationQuantity
//     if (product.quantity === 0) {
//       product.isActive = false
//     }
//     await product.save()

//     res.status(201).json({
//       success: true,
//       message: "Donation created successfully with FreshTrack optimization",
//       data: {
//         donation: await donation.populate("productId ngoId donorId"),
//         impact: {
//           estimatedMeals,
//           environmentalImpact: donation.freshTrackData.environmentalImpact,
//           taxBenefit: `$${taxBenefit.toFixed(2)}`,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Create donation error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create donation",
//       error: error.message,
//     })
//   }
// })

// // Quick donate endpoint for high-risk products
// router.post("/quick-donate/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params
//     const { quantity } = req.body

//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find best NGO match
//     const bestNGO = await findBestNGOMatch(product)

//     if (!bestNGO) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Create donation with optimal quantity
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))

//     // Use the main donation creation logic
//     req.body = {
//       productId,
//       ngoId: bestNGO._id,
//       quantity: donationQuantity,
//       notes: `FreshTrack quick donation - ${product.category} category`,
//     }

//     // Call the main POST handler
//     return router.handle(req, res)
//   } catch (error) {
//     console.error("Quick donate error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create quick donation",
//       error: error.message,
//     })
//   }
// })

// // Update donation status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { status } = req.body
//     const donation = await Donation.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       {
//         status,
//         updatedAt: new Date(),
//         ...(status === "collected" && { collectedAt: new Date() }),
//         ...(status === "delivered" && { deliveredAt: new Date() }),
//       },
//       { new: true },
//     ).populate("productId ngoId donorId")

//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: "Donation not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Donation status updated successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     console.error("Update donation status error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to update donation status",
//       error: error.message,
//     })
//   }
// })

// // Helper functions for ALL categories
// function getCategoryMealFactor(category) {
//   const factors = {
//     dairy: 2.5,
//     meat: 4.0,
//     produce: 2.0,
//     bakery: 3.0,
//     frozen: 3.5,
//     pantry: 2.8,
//     beverages: 1.5,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getCO2Factor(category) {
//   const factors = {
//     dairy: 3.2,
//     meat: 27.0,
//     produce: 2.0,
//     bakery: 1.8,
//     frozen: 4.5,
//     pantry: 1.2,
//     beverages: 0.8,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getWaterFactor(category) {
//   const factors = {
//     dairy: 45,
//     meat: 120,
//     produce: 25,
//     bakery: 35,
//     frozen: 50,
//     pantry: 20,
//     beverages: 15,
//   }
//   return factors[category?.toLowerCase()] || 30
// }

// function calculateRiskFromExpiry(expiryDate) {
//   if (!expiryDate) return 50
//   const now = new Date()
//   const expiry = new Date(expiryDate)
//   const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24)

//   if (daysUntilExpiry <= 1) return 90
//   if (daysUntilExpiry <= 2) return 80
//   if (daysUntilExpiry <= 3) return 70
//   if (daysUntilExpiry <= 5) return 60
//   return 50
// }

// function getCategoryBreakdown(opportunities) {
//   const breakdown = {}
//   opportunities.forEach((item) => {
//     const category = item.category || "other"
//     if (!breakdown[category]) {
//       breakdown[category] = { count: 0, value: 0 }
//     }
//     breakdown[category].count++
//     breakdown[category].value += (item.price?.current || item.price || 0) * item.quantity
//   })
//   return breakdown
// }

// function calculateNGOScore(ngo, category) {
//   let score = ngo.rating?.average || 4.0

//   if (category && ngo.acceptedCategories.includes(category.toLowerCase())) {
//     score += 0.5
//   }

//   if (ngo.lastDonationDate && Date.now() - new Date(ngo.lastDonationDate).getTime() < 7 * 24 * 60 * 60 * 1000) {
//     score += 0.3
//   }

//   if (ngo.totalDonationsReceived > 200) {
//     score += 0.2
//   }

//   return Math.min(5.0, score).toFixed(1)
// }

// function getOptimalPickupWindow(spoilageRisk) {
//   if (spoilageRisk >= 85) return "1-3 hours"
//   if (spoilageRisk >= 75) return "3-6 hours"
//   if (spoilageRisk >= 65) return "6-12 hours"
//   return "12-24 hours"
// }

// async function findBestNGOMatch(product) {
//   try {
//     const ngos = await NGO.find({
//       isActive: true,
//       acceptedCategories: { $in: [product.category?.toLowerCase()] },
//     }).sort({ "rating.average": -1 })

//     return ngos[0] || null
//   } catch (error) {
//     console.error("Find NGO match error:", error)
//     return null
//   }
// }

// module.exports = router

// const express = require("express")
// const Donation = require("../models/Donation")
// const NGO = require("../models/NGO")
// const Product = require("../models/Product")
// const Alert = require("../models/Alert")
// const { auth, authorize } = require("../middleware/auth")

// const router = express.Router()

// // Initialize default data if needed
// const initializeDefaultData = async () => {
//   try {
//     // Check if NGOs exist
//     const ngoCount = await NGO.countDocuments()

//     if (ngoCount === 0) {
//       console.log("🏢 Creating default NGO partners...")

//       const defaultNGOs = [
//         {
//           name: "FreshTrack Partner Food Bank",
//           email: "donations@freshtrackpartner.org",
//           phone: "+1-555-FRESH-1",
//           address: "123 Community Drive, Food District",
//           acceptedCategories: ["dairy", "bakery", "produce", "meat", "frozen", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.8, count: 150 },
//           totalDonationsReceived: 245,
//           lastDonationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//           capacity: "High",
//           contactPerson: {
//             name: "Sarah Johnson",
//             position: "Donation Coordinator",
//             phone: "+1-555-FRESH-1",
//             email: "sarah@freshtrackpartner.org",
//           },
//         },
//         {
//           name: "Community Kitchen Network",
//           email: "help@communitykitchen.org",
//           phone: "+1-555-FRESH-2",
//           address: "456 Helper Street, Care District",
//           acceptedCategories: ["bakery", "produce", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.6, count: 89 },
//           totalDonationsReceived: 156,
//           lastDonationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//           capacity: "Medium",
//           contactPerson: {
//             name: "Mike Chen",
//             position: "Operations Manager",
//             phone: "+1-555-FRESH-2",
//             email: "mike@communitykitchen.org",
//           },
//         },
//         {
//           name: "Homeless Shelter Alliance",
//           email: "intake@shelteralliance.org",
//           phone: "+1-555-FRESH-3",
//           address: "789 Support Avenue, Hope District",
//           acceptedCategories: ["dairy", "meat", "produce", "frozen", "pantry"],
//           isActive: true,
//           rating: { average: 4.9, count: 203 },
//           totalDonationsReceived: 312,
//           lastDonationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//           capacity: "High",
//           contactPerson: {
//             name: "Lisa Rodriguez",
//             position: "Intake Coordinator",
//             phone: "+1-555-FRESH-3",
//             email: "lisa@shelteralliance.org",
//           },
//         },
//         {
//           name: "Local Food Rescue",
//           email: "rescue@localfoodrescue.org",
//           phone: "+1-555-FRESH-4",
//           address: "321 Rescue Road, Help District",
//           acceptedCategories: ["produce", "bakery", "dairy", "beverages"],
//           isActive: true,
//           rating: { average: 4.7, count: 124 },
//           totalDonationsReceived: 189,
//           lastDonationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
//           capacity: "Medium",
//           contactPerson: {
//             name: "David Kim",
//             position: "Rescue Coordinator",
//             phone: "+1-555-FRESH-4",
//             email: "david@localfoodrescue.org",
//           },
//         },
//         {
//           name: "Senior Center Meals Program",
//           email: "meals@seniorcenter.org",
//           phone: "+1-555-FRESH-5",
//           address: "654 Elder Way, Senior District",
//           acceptedCategories: ["dairy", "produce", "pantry", "beverages"],
//           isActive: true,
//           rating: { average: 4.5, count: 67 },
//           totalDonationsReceived: 98,
//           lastDonationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//           capacity: "Low",
//           contactPerson: {
//             name: "Margaret Thompson",
//             position: "Nutrition Director",
//             phone: "+1-555-FRESH-5",
//             email: "margaret@seniorcenter.org",
//           },
//         },
//       ]

//       await NGO.insertMany(defaultNGOs)
//       console.log("✅ Default NGO partners created successfully!")
//     }
//   } catch (error) {
//     console.error("❌ Error initializing default data:", error)
//   }
// }

// // Initialize data on module load
// initializeDefaultData()

// // Get all donations with FreshTrack insights
// router.get("/", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, sortBy = "createdAt", sortOrder = "desc" } = req.query
//     const query = { storeId: req.user.storeId }

//     if (status) query.status = status

//     const options = {
//       page: Number.parseInt(page),
//       limit: Number.parseInt(limit),
//       sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     }

//     const donations = await Donation.find(query)
//       .populate("productId", "name category batch quantity predictions")
//       .populate("ngoId", "name email phone")
//       .populate("donorId", "name email")
//       .sort(options.sort)
//       .limit(options.limit * 1)
//       .skip((options.page - 1) * options.limit)

//     const total = await Donation.countDocuments(query)

//     // Get donation statistics
//     const donationStats = await Donation.aggregate([
//       { $match: { storeId: req.user.storeId } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalValue: { $sum: "$value" },
//           totalQuantity: { $sum: "$quantity" },
//         },
//       },
//     ])

//     res.json({
//       success: true,
//       data: {
//         donations,
//         pagination: {
//           current: options.page,
//           pages: Math.ceil(total / options.limit),
//           total,
//         },
//         statistics: donationStats,
//       },
//     })
//   } catch (error) {
//     console.error("Get donations error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donations",
//       error: error.message,
//     })
//   }
// })

// // Get donation opportunities (products suitable for donation) - ALL CATEGORIES
// router.get("/opportunities", auth, async (req, res) => {
//   try {
//     // Get products from ALL categories with spoilage risk between 50-90%
//     const opportunities = await Product.find({
//       storeId: req.user.storeId,
//       isActive: true,
//       quantity: { $gt: 0 },
//       $or: [
//         { "predictions.spoilageRisk": { $gte: 50, $lte: 90 } },
//         { "dates.expiry": { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }, // Expires within 3 days
//       ],
//     })
//       .populate("userId", "name")
//       .sort({ "predictions.spoilageRisk": -1 })
//       .limit(50) // Increased limit to show more items

//     // Enhance with donation insights for ALL categories
//     const enhancedOpportunities = opportunities.map((product) => {
//       const risk = product.predictions?.spoilageRisk || calculateRiskFromExpiry(product.dates?.expiry)
//       const quantity = product.quantity
//       const value = product.price?.current || product.price || 0

//       return {
//         ...product.toObject(),
//         donationInsights: {
//           urgency: risk > 80 ? "High" : risk > 70 ? "Medium" : "Low",
//           estimatedMeals: Math.round(quantity * getCategoryMealFactor(product.category)),
//           taxBenefit: (value * quantity * 0.18).toFixed(2),
//           environmentalImpact: {
//             co2Saved: `${(quantity * getCO2Factor(product.category)).toFixed(1)} kg`,
//             waterSaved: `${quantity * getWaterFactor(product.category)} liters`,
//           },
//           optimalPickupWindow: getOptimalPickupWindow(risk),
//         },
//       }
//     })

//     res.json({
//       success: true,
//       data: {
//         opportunities: enhancedOpportunities,
//         summary: {
//           totalOpportunities: enhancedOpportunities.length,
//           totalValue: enhancedOpportunities.reduce(
//             (sum, p) => sum + (p.price?.current || p.price || 0) * p.quantity,
//             0,
//           ),
//           totalMeals: enhancedOpportunities.reduce((sum, p) => sum + p.donationInsights.estimatedMeals, 0),
//           categoryBreakdown: getCategoryBreakdown(enhancedOpportunities),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Get opportunities error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donation opportunities",
//       error: error.message,
//     })
//   }
// })

// // Get available NGOs with FreshTrack compatibility
// router.get("/ngos", auth, async (req, res) => {
//   try {
//     const { category } = req.query
//     const query = { isActive: true }

//     if (category) {
//       query.acceptedCategories = { $in: [category.toLowerCase()] }
//     }

//     let ngos = await NGO.find(query)
//       .select(
//         "name email phone address acceptedCategories rating totalDonationsReceived lastDonationDate capacity contactPerson",
//       )
//       .sort({ "rating.average": -1 })

//     // Ensure we have NGOs (initialize if needed)
//     if (ngos.length === 0) {
//       await initializeDefaultData()
//       ngos = await NGO.find(query)
//         .select(
//           "name email phone address acceptedCategories rating totalDonationsReceived lastDonationDate capacity contactPerson",
//         )
//         .sort({ "rating.average": -1 })
//     }

//     // Add FreshTrack compatibility scores
//     const enhancedNGOs = ngos.map((ngo) => ({
//       ...ngo.toObject(),
//       freshTrackScore: calculateNGOScore(ngo, category),
//       distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
//     }))

//     res.json({
//       success: true,
//       data: { ngos: enhancedNGOs },
//     })
//   } catch (error) {
//     console.error("Get NGOs error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch NGOs",
//       error: error.message,
//     })
//   }
// })

// // Create donation with FreshTrack optimization
// router.post("/", auth, authorize("manager", "staff"), async (req, res) => {
//   try {
//     const { productId, ngoId, quantity, notes } = req.body

//     // Verify product exists and belongs to user's store
//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find or create default NGO if none provided
//     let ngo
//     if (ngoId) {
//       ngo = await NGO.findOne({ _id: ngoId, isActive: true })
//     } else {
//       ngo = await findBestNGOMatch(product)
//     }

//     if (!ngo) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Check if quantity is available
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))
//     if (donationQuantity > product.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient quantity available",
//       })
//     }

//     // Calculate donation value and impact
//     const value = (product.price?.current || product.price || 0) * donationQuantity
//     const estimatedMeals = donationQuantity * getCategoryMealFactor(product.category)
//     const co2Saved = donationQuantity * getCO2Factor(product.category)
//     const taxBenefit = value * 0.18

//     const donation = new Donation({
//       productId,
//       ngoId: ngo._id,
//       donorId: req.user._id,
//       quantity: donationQuantity,
//       notes: notes || `FreshTrack optimized donation for ${product.category}`,
//       value,
//       storeId: req.user.storeId,
//       freshTrackData: {
//         spoilageRisk: product.predictions?.spoilageRisk || 0,
//         estimatedMeals,
//         environmentalImpact: {
//           co2Saved: `${co2Saved.toFixed(1)} kg`,
//           waterSaved: `${donationQuantity * getWaterFactor(product.category)} liters`,
//         },
//         taxBenefit: taxBenefit.toFixed(2),
//       },
//     })

//     await donation.save()

//     // Update product quantity
//     product.quantity -= donationQuantity
//     if (product.quantity === 0) {
//       product.isActive = false
//     }
//     await product.save()

//     res.status(201).json({
//       success: true,
//       message: "Donation created successfully with FreshTrack optimization",
//       data: {
//         donation: await donation.populate("productId ngoId donorId"),
//         impact: {
//           estimatedMeals,
//           environmentalImpact: donation.freshTrackData.environmentalImpact,
//           taxBenefit: `$${taxBenefit.toFixed(2)}`,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Create donation error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create donation",
//       error: error.message,
//     })
//   }
// })

// // Quick donate endpoint for high-risk products
// router.post("/quick-donate/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params
//     const { quantity } = req.body

//     const product = await Product.findOne({
//       _id: productId,
//       storeId: req.user.storeId,
//       isActive: true,
//     })

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Find best NGO match
//     const bestNGO = await findBestNGOMatch(product)

//     if (!bestNGO) {
//       return res.status(404).json({
//         success: false,
//         message: "No suitable NGO found for this product category",
//       })
//     }

//     // Create donation with optimal quantity
//     const donationQuantity = quantity || Math.min(product.quantity, Math.ceil(product.quantity * 0.8))

//     // Calculate donation value and impact
//     const value = (product.price?.current || product.price || 0) * donationQuantity
//     const estimatedMeals = donationQuantity * getCategoryMealFactor(product.category)
//     const co2Saved = donationQuantity * getCO2Factor(product.category)
//     const taxBenefit = value * 0.18

//     const donation = new Donation({
//       productId,
//       ngoId: bestNGO._id,
//       donorId: req.user._id,
//       quantity: donationQuantity,
//       notes: `FreshTrack quick donation - ${product.category} category`,
//       value,
//       storeId: req.user.storeId,
//       freshTrackData: {
//         spoilageRisk: product.predictions?.spoilageRisk || 0,
//         estimatedMeals,
//         environmentalImpact: {
//           co2Saved: `${co2Saved.toFixed(1)} kg`,
//           waterSaved: `${donationQuantity * getWaterFactor(product.category)} liters`,
//         },
//         taxBenefit: taxBenefit.toFixed(2),
//       },
//     })

//     await donation.save()

//     // Update product quantity
//     product.quantity -= donationQuantity
//     if (product.quantity === 0) {
//       product.isActive = false
//     }
//     await product.save()

//     res.status(201).json({
//       success: true,
//       message: "Quick donation created successfully",
//       data: {
//         donation: await donation.populate("productId ngoId donorId"),
//         impact: {
//           estimatedMeals,
//           environmentalImpact: donation.freshTrackData.environmentalImpact,
//           taxBenefit: `$${taxBenefit.toFixed(2)}`,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Quick donate error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create quick donation",
//       error: error.message,
//     })
//   }
// })

// // Update donation status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { status } = req.body
//     const donation = await Donation.findOneAndUpdate(
//       { _id: req.params.id, storeId: req.user.storeId },
//       {
//         status,
//         updatedAt: new Date(),
//         ...(status === "collected" && { collectedAt: new Date() }),
//         ...(status === "delivered" && { deliveredAt: new Date() }),
//       },
//       { new: true },
//     ).populate("productId ngoId donorId")

//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: "Donation not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Donation status updated successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     console.error("Update donation status error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to update donation status",
//       error: error.message,
//     })
//   }
// })

// // Helper functions for ALL categories
// function getCategoryMealFactor(category) {
//   const factors = {
//     dairy: 2.5,
//     meat: 4.0,
//     produce: 2.0,
//     bakery: 3.0,
//     frozen: 3.5,
//     pantry: 2.8,
//     beverages: 1.5,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getCO2Factor(category) {
//   const factors = {
//     dairy: 3.2,
//     meat: 27.0,
//     produce: 2.0,
//     bakery: 1.8,
//     frozen: 4.5,
//     pantry: 1.2,
//     beverages: 0.8,
//   }
//   return factors[category?.toLowerCase()] || 2.5
// }

// function getWaterFactor(category) {
//   const factors = {
//     dairy: 45,
//     meat: 120,
//     produce: 25,
//     bakery: 35,
//     frozen: 50,
//     pantry: 20,
//     beverages: 15,
//   }
//   return factors[category?.toLowerCase()] || 30
// }

// function calculateRiskFromExpiry(expiryDate) {
//   if (!expiryDate) return 50
//   const now = new Date()
//   const expiry = new Date(expiryDate)
//   const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24)

//   if (daysUntilExpiry <= 1) return 90
//   if (daysUntilExpiry <= 2) return 80
//   if (daysUntilExpiry <= 3) return 70
//   if (daysUntilExpiry <= 5) return 60
//   return 50
// }

// function getCategoryBreakdown(opportunities) {
//   const breakdown = {}
//   opportunities.forEach((item) => {
//     const category = item.category || "other"
//     if (!breakdown[category]) {
//       breakdown[category] = { count: 0, value: 0 }
//     }
//     breakdown[category].count++
//     breakdown[category].value += (item.price?.current || item.price || 0) * item.quantity
//   })
//   return breakdown
// }

// function calculateNGOScore(ngo, category) {
//   let score = ngo.rating?.average || 4.0

//   if (category && ngo.acceptedCategories.includes(category.toLowerCase())) {
//     score += 0.5
//   }

//   if (ngo.lastDonationDate && Date.now() - new Date(ngo.lastDonationDate).getTime() < 7 * 24 * 60 * 60 * 1000) {
//     score += 0.3
//   }

//   if (ngo.totalDonationsReceived > 200) {
//     score += 0.2
//   }

//   return Math.min(5.0, score).toFixed(1)
// }

// function getOptimalPickupWindow(spoilageRisk) {
//   if (spoilageRisk >= 85) return "1-3 hours"
//   if (spoilageRisk >= 75) return "3-6 hours"
//   if (spoilageRisk >= 65) return "6-12 hours"
//   return "12-24 hours"
// }

// async function findBestNGOMatch(product) {
//   try {
//     const ngos = await NGO.find({
//       isActive: true,
//       acceptedCategories: { $in: [product.category?.toLowerCase()] },
//     }).sort({ "rating.average": -1 })

//     return ngos[0] || null
//   } catch (error) {
//     console.error("Find NGO match error:", error)
//     return null
//   }
// }

// module.exports = router
// const express = require("express")
// const { auth } = require("../middleware/auth")
// const excelDataService = require("../services/excelDataService")

// const router = express.Router()

// // Get all donations from Excel data
// router.get("/", auth, async (req, res) => {
//   try {
//     const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")

//     // Transform donations to match frontend expectations
//     const transformedDonations = donations.map((donation, index) => ({
//       _id: donation.donation_id || `D${index + 1}`,
//       productId: {
//         _id: donation.product_id,
//         name: `${donation.category || "Product"} ${donation.product_id}`,
//       },
//       ngoId: {
//         _id: `ngo_${donation.ngo_name.replace(/\s+/g, "_").toLowerCase()}`,
//         name: donation.ngo_name,
//         phone: "+1-555-" + Math.floor(Math.random() * 9000 + 1000),
//       },
//       quantity: donation.quantity || 10,
//       value: (donation.quantity || 10) * 5.99,
//       status: donation.status || (Math.random() > 0.7 ? "delivered" : Math.random() > 0.5 ? "collected" : "confirmed"),
//       notes: `Donation triggered by: ${donation.match_trigger_reason || "system"}`,
//       createdAt: donation.pickup_date || new Date().toISOString(),
//       freshTrackData: {
//         estimatedMeals: (donation.quantity || 10) * 2.5,
//         environmentalImpact: {
//           co2Saved: `${((donation.quantity || 10) * 2.1).toFixed(1)} kg CO2`,
//         },
//       },
//     }))

//     // Calculate statistics
//     const statistics = transformedDonations.reduce((acc, donation) => {
//       const status = donation.status
//       if (!acc.find((s) => s._id === status)) {
//         acc.push({ _id: status, count: 0, totalValue: 0 })
//       }
//       const stat = acc.find((s) => s._id === status)
//       stat.count++
//       stat.totalValue += donation.value
//       return acc
//     }, [])

//     res.json({
//       success: true,
//       data: {
//         donations: transformedDonations,
//         statistics,
//         summary: {
//           totalDonations: transformedDonations.length,
//           totalValue: transformedDonations.reduce((sum, d) => sum + d.value, 0),
//           totalMeals: transformedDonations.reduce((sum, d) => sum + d.freshTrackData.estimatedMeals, 0),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Donation fetch error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donations from Excel data",
//       error: error.message,
//     })
//   }
// })

// // Get donation opportunities from Excel data
// router.get("/opportunities", auth, async (req, res) => {
//   try {
//     const opportunities = excelDataService.getDonationOpportunities()

//     // Transform to match frontend expectations
//     const transformedOpportunities = opportunities.map((item) => ({
//       _id: item.product_id,
//       name: `${item.category} Product ${item.product_id}`,
//       category: item.category,
//       quantity: item.current_stock,
//       price: {
//         current: 5.99,
//         original: 5.99,
//       },
//       dates: {
//         expiry: item.expiry_date,
//         received: item.arrival_date,
//       },
//       predictions: {
//         spoilageRisk: item.predictions.spoilageRisk,
//       },
//       donationInsights: item.donationInsights,
//       status: item.status,
//     }))

//     res.json({
//       success: true,
//       data: {
//         opportunities: transformedOpportunities,
//         summary: {
//           total: transformedOpportunities.length,
//           totalValue: transformedOpportunities.reduce((sum, opp) => sum + opp.price.current * opp.quantity, 0),
//           estimatedMeals: transformedOpportunities.reduce(
//             (sum, opp) => sum + (opp.donationInsights?.estimatedMeals || 0),
//             0,
//           ),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Opportunities fetch error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch donation opportunities",
//       error: error.message,
//     })
//   }
// })

// // Get NGO partners from Excel data
// router.get("/ngos", auth, async (req, res) => {
//   try {
//     const ngos = excelDataService.getNGOData()

//     res.json({
//       success: true,
//       data: {
//         ngos,
//         summary: {
//           total: ngos.length,
//           totalDonations: ngos.reduce((sum, ngo) => sum + (ngo.donationCount || 0), 0),
//           totalQuantity: ngos.reduce((sum, ngo) => sum + (ngo.totalQuantity || 0), 0),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("NGO fetch error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch NGO data",
//       error: error.message,
//     })
//   }
// })

// // Quick donate functionality
// router.post("/quick-donate/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params
//     const { quantity } = req.body

//     // Get product data from Excel
//     const products = excelDataService.getEnrichedInventoryData()
//     const product = products.find((p) => p.product_id === productId)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found in Excel data",
//       })
//     }

//     // Get NGO data
//     const ngos = excelDataService.getNGOData()
//     const selectedNGO = ngos[0] || {
//       _id: "default_ngo",
//       name: "Community Food Bank",
//       phone: "+1-555-0123",
//     }

//     // Create donation record
//     const donationQuantity = quantity || Math.ceil(product.current_stock * 0.8)
//     const donation = {
//       _id: `donation_${Date.now()}`,
//       productId: product.product_id,
//       ngoId: selectedNGO._id,
//       quantity: donationQuantity,
//       value: donationQuantity * 5.99,
//       status: "pending",
//       createdAt: new Date().toISOString(),
//       freshTrackData: {
//         estimatedMeals: donationQuantity * 2.5,
//         environmentalImpact: {
//           co2Saved: `${(donationQuantity * 2.1).toFixed(1)} kg CO2`,
//         },
//       },
//       productName: `${product.category} Product ${product.product_id}`,
//       ngoName: selectedNGO.name,
//     }

//     // In a real implementation, you would save this to database/Excel
//     console.log("Quick donation created:", donation)

//     res.json({
//       success: true,
//       message: "Quick donation created successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     console.error("Quick donate error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create quick donation",
//       error: error.message,
//     })
//   }
// })

// // Create regular donation
// router.post("/create", auth, async (req, res) => {
//   try {
//     const { productId, ngoId, quantity, notes } = req.body

//     // Get product data
//     const products = excelDataService.getEnrichedInventoryData()
//     const product = products.find((p) => p.product_id === productId)

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       })
//     }

//     // Get NGO data
//     const ngos = excelDataService.getNGOData()
//     const selectedNGO = ngos.find((ngo) => ngo._id === ngoId) || ngos[0]

//     const donation = {
//       _id: `donation_${Date.now()}`,
//       productId: product.product_id,
//       ngoId: selectedNGO._id,
//       quantity: quantity || Math.ceil(product.current_stock * 0.8),
//       value: (quantity || Math.ceil(product.current_stock * 0.8)) * 5.99,
//       status: "pending",
//       notes: notes || "",
//       createdAt: new Date().toISOString(),
//       freshTrackData: {
//         estimatedMeals: (quantity || Math.ceil(product.current_stock * 0.8)) * 2.5,
//         environmentalImpact: {
//           co2Saved: `${((quantity || Math.ceil(product.current_stock * 0.8)) * 2.1).toFixed(1)} kg CO2`,
//         },
//       },
//     }

//     res.json({
//       success: true,
//       message: "Donation scheduled successfully",
//       data: { donation },
//     })
//   } catch (error) {
//     console.error("Create donation error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create donation",
//       error: error.message,
//     })
//   }
// })

// // Update donation status
// router.put("/:id/status", auth, async (req, res) => {
//   try {
//     const { id } = req.params
//     const { status } = req.body

//     // In real implementation, update the database/Excel file
//     res.json({
//       success: true,
//       message: `Donation status updated to ${status}`,
//       data: { id, status, updatedAt: new Date().toISOString() },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update donation status",
//       error: error.message,
//     })
//   }
// })

// // Get optimal donation matches for a product
// router.get("/optimal-matches/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params

//     // Get NGO data
//     const ngos = excelDataService.getNGOData()

//     // Return top 3 NGOs as optimal matches
//     const matches = ngos.slice(0, 3).map((ngo) => ({
//       ...ngo,
//       matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
//       estimatedPickupTime: "2-4 hours",
//     }))

//     res.json({
//       success: true,
//       data: { matches },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get optimal matches",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

const express = require("express")
const { auth } = require("../middleware/auth")
const excelDataService = require("../services/excelDataService")

const router = express.Router()

// Get all donations from Excel data
router.get("/", auth, async (req, res) => {
  try {
    const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")

    // Transform donations to match frontend expectations
    const transformedDonations = donations.map((donation, index) => ({
      _id: donation.donation_id || `D${index + 1}`,
      productId: {
        _id: donation.product_id,
        name: `${donation.category || "Product"} ${donation.product_id}`,
      },
      ngoId: {
        _id: `ngo_${donation.ngo_name.replace(/\s+/g, "_").toLowerCase()}`,
        name: donation.ngo_name,
        phone: "+1-555-" + Math.floor(Math.random() * 9000 + 1000),
      },
      quantity: donation.quantity || 10,
      value: (donation.quantity || 10) * 5.99,
      status: donation.status || (Math.random() > 0.7 ? "delivered" : Math.random() > 0.5 ? "collected" : "confirmed"),
      notes: `Donation triggered by: ${donation.match_trigger_reason || "system"}`,
      createdAt: donation.pickup_date || new Date().toISOString(),
      freshTrackData: {
        estimatedMeals: (donation.quantity || 10) * 2.5,
        environmentalImpact: {
          co2Saved: `${((donation.quantity || 10) * 2.1).toFixed(1)} kg CO2`,
        },
      },
    }))

    // Calculate statistics
    const statistics = transformedDonations.reduce((acc, donation) => {
      const status = donation.status
      if (!acc.find((s) => s._id === status)) {
        acc.push({ _id: status, count: 0, totalValue: 0 })
      }
      const stat = acc.find((s) => s._id === status)
      stat.count++
      stat.totalValue += donation.value
      return acc
    }, [])

    res.json({
      success: true,
      data: {
        donations: transformedDonations,
        statistics,
        summary: {
          totalDonations: transformedDonations.length,
          totalValue: transformedDonations.reduce((sum, d) => sum + d.value, 0),
          totalMeals: transformedDonations.reduce((sum, d) => sum + d.freshTrackData.estimatedMeals, 0),
        },
      },
    })
  } catch (error) {
    console.error("Donation fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations from Excel data",
      error: error.message,
    })
  }
})

// Get donation opportunities from Excel data
router.get("/opportunities", auth, async (req, res) => {
  try {
    const opportunities = excelDataService.getDonationOpportunities()

    // Transform to match frontend expectations
    const transformedOpportunities = opportunities.map((item) => ({
      _id: item.product_id,
      name: `${item.category} Product ${item.product_id}`,
      category: item.category,
      quantity: item.current_stock,
      price: {
        current: 5.99,
        original: 5.99,
      },
      dates: {
        expiry: item.expiry_date,
        received: item.arrival_date,
      },
      predictions: {
        spoilageRisk: item.predictions.spoilageRisk,
      },
      donationInsights: item.donationInsights,
      status: item.status,
    }))

    res.json({
      success: true,
      data: {
        opportunities: transformedOpportunities,
        summary: {
          total: transformedOpportunities.length,
          totalValue: transformedOpportunities.reduce((sum, opp) => sum + opp.price.current * opp.quantity, 0),
          estimatedMeals: transformedOpportunities.reduce(
            (sum, opp) => sum + (opp.donationInsights?.estimatedMeals || 0),
            0,
          ),
        },
      },
    })
  } catch (error) {
    console.error("Opportunities fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation opportunities",
      error: error.message,
    })
  }
})

// Get NGO partners from Excel data
router.get("/ngos", auth, async (req, res) => {
  try {
    const ngos = excelDataService.getNGOData()

    res.json({
      success: true,
      data: {
        ngos,
        summary: {
          total: ngos.length,
          totalDonations: ngos.reduce((sum, ngo) => sum + (ngo.donationCount || 0), 0),
          totalQuantity: ngos.reduce((sum, ngo) => sum + (ngo.totalQuantity || 0), 0),
        },
      },
    })
  } catch (error) {
    console.error("NGO fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGO data",
      error: error.message,
    })
  }
})

// Quick donate functionality
router.post("/quick-donate/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    // Get product data from Excel
    const products = excelDataService.getEnrichedInventoryData()
    const product = products.find((p) => p.product_id === productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in Excel data",
      })
    }

    // Get NGO data
    const ngos = excelDataService.getNGOData()
    const selectedNGO = ngos[0] || {
      _id: "default_ngo",
      name: "Community Food Bank",
      phone: "+1-555-0123",
    }

    // Create donation record
    const donationQuantity = quantity || Math.ceil(product.current_stock * 0.8)
    const donation = {
      _id: `donation_${Date.now()}`,
      productId: product.product_id,
      ngoId: selectedNGO._id,
      quantity: donationQuantity,
      value: donationQuantity * 5.99,
      status: "pending",
      createdAt: new Date().toISOString(),
      freshTrackData: {
        estimatedMeals: donationQuantity * 2.5,
        environmentalImpact: {
          co2Saved: `${(donationQuantity * 2.1).toFixed(1)} kg CO2`,
        },
      },
      productName: `${product.category} Product ${product.product_id}`,
      ngoName: selectedNGO.name,
    }

    // In a real implementation, you would save this to database/Excel
    console.log("Quick donation created:", donation)

    res.json({
      success: true,
      message: "Quick donation created successfully",
      data: { donation },
    })
  } catch (error) {
    console.error("Quick donate error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create quick donation",
      error: error.message,
    })
  }
})

// Create regular donation
router.post("/create", auth, async (req, res) => {
  try {
    const { productId, ngoId, quantity, notes } = req.body

    // Get product data
    const products = excelDataService.getEnrichedInventoryData()
    const product = products.find((p) => p.product_id === productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Get NGO data
    const ngos = excelDataService.getNGOData()
    const selectedNGO = ngos.find((ngo) => ngo._id === ngoId) || ngos[0]

    const donation = {
      _id: `donation_${Date.now()}`,
      productId: product.product_id,
      ngoId: selectedNGO._id,
      quantity: quantity || Math.ceil(product.current_stock * 0.8),
      value: (quantity || Math.ceil(product.current_stock * 0.8)) * 5.99,
      status: "pending",
      notes: notes || "",
      createdAt: new Date().toISOString(),
      freshTrackData: {
        estimatedMeals: (quantity || Math.ceil(product.current_stock * 0.8)) * 2.5,
        environmentalImpact: {
          co2Saved: `${((quantity || Math.ceil(product.current_stock * 0.8)) * 2.1).toFixed(1)} kg CO2`,
        },
      },
    }

    res.json({
      success: true,
      message: "Donation scheduled successfully",
      data: { donation },
    })
  } catch (error) {
    console.error("Create donation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create donation",
      error: error.message,
    })
  }
})

// Update donation status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // In real implementation, update the database/Excel file
    res.json({
      success: true,
      message: `Donation status updated to ${status}`,
      data: { id, status, updatedAt: new Date().toISOString() },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update donation status",
      error: error.message,
    })
  }
})

// Get optimal donation matches for a product
router.get("/optimal-matches/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params

    // Get NGO data
    const ngos = excelDataService.getNGOData()

    // Return top 3 NGOs as optimal matches
    const matches = ngos.slice(0, 3).map((ngo) => ({
      ...ngo,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
      estimatedPickupTime: "2-4 hours",
    }))

    res.json({
      success: true,
      data: { matches },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get optimal matches",
      error: error.message,
    })
  }
})

// Schedule pickup for donation
router.post("/:id/schedule", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { pickupDate, notes } = req.body

    // In real implementation, update the database/Excel file
    res.json({
      success: true,
      message: "Pickup scheduled successfully",
      data: {
        donationId: id,
        pickupDate,
        notes,
        scheduledAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to schedule pickup",
      error: error.message,
    })
  }
})

// Cancel donation
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    res.json({
      success: true,
      message: "Donation cancelled successfully",
      data: {
        donationId: id,
        reason,
        cancelledAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel donation",
      error: error.message,
    })
  }
})

// Get donation history
router.get("/history", auth, async (req, res) => {
  try {
    const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")

    // Transform to history format
    const history = donations.map((donation, index) => ({
      _id: donation.donation_id || `H${index + 1}`,
      date: donation.pickup_date || new Date().toISOString(),
      ngoName: donation.ngo_name,
      quantity: donation.quantity || 10,
      status: "completed",
      value: (donation.quantity || 10) * 5.99,
    }))

    res.json({
      success: true,
      data: { history },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get donation history",
      error: error.message,
    })
  }
})

// Get donation impact
router.get("/impact", auth, async (req, res) => {
  try {
    const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")

    const impact = {
      totalDonations: donations.length,
      totalValue: donations.reduce((sum, d) => sum + (d.quantity || 10) * 5.99, 0),
      totalMeals: donations.reduce((sum, d) => sum + (d.quantity || 10) * 2.5, 0),
      co2Saved: donations.reduce((sum, d) => sum + (d.quantity || 10) * 2.1, 0),
      wasteReduced: donations.reduce((sum, d) => sum + (d.quantity || 10), 0),
    }

    res.json({
      success: true,
      data: { impact },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get donation impact",
      error: error.message,
    })
  }
})

// Bulk donation operations
router.post("/bulk", auth, async (req, res) => {
  try {
    const { donations } = req.body

    // Process bulk donations
    const results = donations.map((donation, index) => ({
      _id: `bulk_${Date.now()}_${index}`,
      productId: donation.productId,
      ngoId: donation.ngoId,
      quantity: donation.quantity,
      status: "pending",
      createdAt: new Date().toISOString(),
    }))

    res.json({
      success: true,
      message: `${results.length} donations created successfully`,
      data: { donations: results },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create bulk donations",
      error: error.message,
    })
  }
})

module.exports = router
