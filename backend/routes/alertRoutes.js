// const express = require('express')
// const Alert = require('../models/Alert')
// const { protect, checkPermission } = require('../middleware/auth')
// const router = express.Router()

// // @route   GET /api/alerts
// // @desc    Get all alerts with filtering
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       type,
//       status = 'active',
//       category,
//       priority
//     } = req.query

//     // Build filter
//     const filter = {}
    
//     // Store filter
//     if (req.user.role !== 'admin') {
//       filter['source.storeId'] = req.user.storeId
//     }

//     if (type) filter.type = type
//     if (status !== 'all') filter.status = status
//     if (category) filter.category = category
//     if (priority) filter.priority = priority

//     const skip = (page - 1) * limit
//     const alerts = await Alert.find(filter)
//       .populate('source.userId', 'name email')
//       .populate('source.productId', 'name batch category')
//       .populate('resolvedBy', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))

//     const total = await Alert.countDocuments(filter)

//     // Get unread count for current user
//     const unreadCount = await Alert.countDocuments({
//       ...filter,
//       'recipients.userId': req.user.id,
//       'recipients.read': false
//     })

//     res.json({
//       success: true,
//       data: {
//         alerts,
//         pagination: {
//           current: parseInt(page),
//           pages: Math.ceil(total / limit),
//           total,
//           limit: parseInt(limit)
//         },
//         unreadCount
//       }
//     })
//   } catch (error) {
//     console.error('Get alerts error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/alerts
// // @desc    Create new alert
// // @access  Private
// router.post('/', protect, async (req, res) => {
//   try {
//     const alertData = {
//       ...req.body,
//       source: {
//         ...req.body.source,
//         userId: req.user.id,
//         storeId: req.user.storeId
//       }
//     }

//     const alert = await Alert.create(alertData)

//     res.status(201).json({
//       success: true,
//       message: 'Alert created successfully',
//       data: { alert }
//     })
//   } catch (error) {
//     console.error('Create alert error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during alert creation',
//       error: error.message
//     })
//   }
// })

// // @route   PUT /api/alerts/:id/acknowledge
// // @desc    Acknowledge alert
// // @access  Private
// router.put('/:id/acknowledge', protect, async (req, res) => {
//   try {
//     const alert = await Alert.findById(req.params.id)

//     if (!alert) {
//       return res.status(404).json({
//         success: false,
//         message: 'Alert not found'
//       })
//     }

//     await alert.acknowledge(req.user.id)

//     res.json({
//       success: true,
//       message: 'Alert acknowledged successfully',
//       data: { alert }
//     })
//   } catch (error) {
//     console.error('Acknowledge alert error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   PUT /api/alerts/:id/resolve
// // @desc    Resolve alert
// // @access  Private
// router.put('/:id/resolve', protect, async (req, res) => {
//   try {
//     const { resolution } = req.body
//     const alert = await Alert.findById(req.params.id)

//     if (!alert) {
//       return res.status(404).json({
//         success: false,
//         message: 'Alert not found'
//       })
//     }

//     await alert.resolve(req.user.id, resolution)

//     res.json({
//       success: true,
//       message: 'Alert resolved successfully',
//       data: { alert }
//     })
//   } catch (error) {
//     console.error('Resolve alert error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   DELETE /api/alerts/:id
// // @desc    Dismiss alert
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const alert = await Alert.findById(req.params.id)

//     if (!alert) {
//       return res.status(404).json({
//         success: false,
//         message: 'Alert not found'
//       })
//     }

//     alert.status = 'dismissed'
//     await alert.save()

//     res.json({
//       success: true,
//       message: 'Alert dismissed successfully'
//     })
//   } catch (error) {
//     console.error('Dismiss alert error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// module.exports = router


const express = require("express")
const { auth } = require("../middleware/auth")
const excelDataService = require("../services/excelDataService")

const router = express.Router()

// Get all alerts (generated from Excel data)
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, severity, status = "all", sortBy = "createdAt", sortOrder = "desc" } = req.query

    // Get enriched inventory data to generate alerts
    const products = excelDataService.getEnrichedInventoryData()
    const actionLog = excelDataService.readExcelFile("FreshTrack_ActionLog.xlsx")

    // Generate alerts from product data
    let alerts = []

    // Critical spoilage alerts
    products
      .filter((p) => p.predictions.spoilageRisk >= 85)
      .forEach((product, index) => {
        alerts.push({
          id: `critical_${product.product_id}`,
          type: "critical",
          title: `${product.category} expires in ${product.predictions.daysToExpiry} day(s)`,
          message: `Product ${product.product_id} (${product.current_stock} units) needs immediate action`,
          timestamp: new Date(Date.now() - index * 60000).toISOString(),
          actions: ["Apply 50% discount", "Donate immediately", "Contact NGO"],
          isRead: Math.random() > 0.7,
          confidence: 95,
          productId: product.product_id,
          metadata: {
            spoilageRisk: product.predictions.spoilageRisk,
            quantity: product.current_stock,
            category: product.category,
            expiryDate: product.expiry_date,
          },
        })
      })

    // Warning alerts for medium risk products
    products
      .filter((p) => p.predictions.spoilageRisk >= 70 && p.predictions.spoilageRisk < 85)
      .forEach((product, index) => {
        alerts.push({
          id: `warning_${product.product_id}`,
          type: "warning",
          title: `${product.category} showing early spoilage signs`,
          message: `Product ${product.product_id} has ${product.predictions.spoilageRisk}% spoilage risk`,
          timestamp: new Date(Date.now() - (index + 10) * 60000).toISOString(),
          actions: ["Apply discount", "Monitor closely", "Schedule donation"],
          isRead: Math.random() > 0.5,
          confidence: 88,
          productId: product.product_id,
          metadata: {
            spoilageRisk: product.predictions.spoilageRisk,
            quantity: product.current_stock,
            category: product.category,
          },
        })
      })

    // Environmental alerts
    const environment = excelDataService.readExcelFile("FreshTrack_Environment.xlsx")
    environment
      .filter((env) => env.avg_temp_C > 8 || env.humidity_percent > 75)
      .forEach((env, index) => {
        alerts.push({
          id: `env_${env.store_id}_${index}`,
          type: "warning",
          title: `Environmental alert in store ${env.store_id}`,
          message: `Temperature: ${env.avg_temp_C}°C, Humidity: ${env.humidity_percent}%`,
          timestamp: new Date(Date.now() - (index + 20) * 60000).toISOString(),
          actions: ["Check refrigeration", "Adjust climate control"],
          isRead: Math.random() > 0.6,
          confidence: 92,
          metadata: {
            storeId: env.store_id,
            temperature: env.avg_temp_C,
            humidity: env.humidity_percent,
          },
        })
      })

    // Donation success alerts
    const donations = excelDataService.readExcelFile("FreshTrack_Donations.xlsx")
    donations.slice(0, 3).forEach((donation, index) => {
      alerts.push({
        id: `donation_${donation.donation_id || index}`,
        type: "success",
        title: "Successful donation completed",
        message: `${donation.ngo_name} collected ${donation.quantity} units, saving $${(donation.quantity * 5.99).toFixed(2)}`,
        timestamp: donation.pickup_date || new Date(Date.now() - (index + 30) * 60000).toISOString(),
        actions: [],
        isRead: true,
        confidence: 100,
        metadata: {
          ngoName: donation.ngo_name,
          quantity: donation.quantity,
          value: donation.quantity * 5.99,
        },
      })
    })

    // Apply filters
    if (type && type !== "all") {
      alerts = alerts.filter((alert) => alert.type === type)
    }
    if (status === "unread") {
      alerts = alerts.filter((alert) => !alert.isRead)
    }

    // Sort alerts
    alerts.sort((a, b) => {
      const aVal = new Date(a.timestamp)
      const bVal = new Date(b.timestamp)
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedAlerts = alerts.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        alerts: paginatedAlerts,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(alerts.length / limit),
          total: alerts.length,
        },
        summary: {
          total: alerts.length,
          unread: alerts.filter((a) => !a.isRead).length,
          critical: alerts.filter((a) => a.type === "critical").length,
          warning: alerts.filter((a) => a.type === "warning").length,
        },
      },
    })
  } catch (error) {
    console.error("Alerts fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message,
    })
  }
})

// Acknowledge alert
router.put("/:id/acknowledge", auth, async (req, res) => {
  try {
    const { id } = req.params

    // In real implementation, update the database/Excel file
    res.json({
      success: true,
      message: "Alert acknowledged successfully",
      data: {
        id,
        status: "acknowledged",
        acknowledgedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge alert",
      error: error.message,
    })
  }
})

// Resolve alert
router.put("/:id/resolve", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { resolution } = req.body

    res.json({
      success: true,
      message: "Alert resolved successfully",
      data: {
        id,
        status: "resolved",
        resolution,
        resolvedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resolve alert",
      error: error.message,
    })
  }
})

// Dismiss alert
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params

    res.json({
      success: true,
      message: "Alert dismissed successfully",
      data: { id, status: "dismissed" },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to dismiss alert",
      error: error.message,
    })
  }
})

module.exports = router
