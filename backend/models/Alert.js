// const mongoose = require('mongoose')

// const alertSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     required: [true, 'Alert type is required'],
//     enum: ['info', 'warning', 'critical', 'success'],
//     index: true
//   },
//   category: {
//     type: String,
//     required: [true, 'Alert category is required'],
//     enum: ['spoilage', 'inventory', 'system', 'donation', 'temperature', 'quality'],
//     index: true
//   },
//   title: {
//     type: String,
//     required: [true, 'Alert title is required'],
//     maxlength: [200, 'Title cannot exceed 200 characters']
//   },
//   message: {
//     type: String,
//     required: [true, 'Alert message is required'],
//     maxlength: [1000, 'Message cannot exceed 1000 characters']
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium',
//     index: true
//   },
//   status: {
//     type: String,
//     enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
//     default: 'active',
//     index: true
//   },
//   source: {
//     type: {
//       type: String,
//       enum: ['system', 'user', 'ml_model', 'sensor', 'manual'],
//       required: true
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product'
//     },
//     storeId: String
//   },
//   data: {
//     confidence: Number,
//     threshold: Number,
//     currentValue: Number,
//     previousValue: Number,
//     modelVersion: String,
//     sensorId: String,
//     features: mongoose.Schema.Types.Mixed
//   },
//   actions: [{
//     type: {
//       type: String,
//       enum: ['discount', 'donate', 'inspect', 'move', 'contact', 'reorder'],
//       required: true
//     },
//     description: {
//       type: String,
//       required: true
//     },
//     automated: {
//       type: Boolean,
//       default: false
//     },
//     completed: {
//       type: Boolean,
//       default: false
//     },
//     completedAt: Date,
//     completedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],
//   recipients: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     method: {
//       type: String,
//       enum: ['email', 'sms', 'push', 'system'],
//       required: true
//     },
//     sent: {
//       type: Boolean,
//       default: false
//     },
//     sentAt: Date,
//     read: {
//       type: Boolean,
//       default: false
//     },
//     readAt: Date
//   }],
//   resolvedAt: Date,
//   resolvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   resolution: String,
//   expiresAt: Date
// }, {
//   timestamps: true
// })

// // Index for efficient queries
// alertSchema.index({ type: 1, status: 1, createdAt: -1 })
// alertSchema.index({ 'source.storeId': 1, status: 1 })
// alertSchema.index({ priority: 1, status: 1 })

// // Method to mark alert as resolved
// alertSchema.methods.resolve = function(userId, resolution) {
//   this.status = 'resolved'
//   this.resolvedAt = new Date()
//   this.resolvedBy = userId
//   this.resolution = resolution
//   return this.save()
// }

// // Method to acknowledge alert
// alertSchema.methods.acknowledge = function(userId) {
//   this.status = 'acknowledged'
//   // Mark as read for the acknowledging user
//   const recipient = this.recipients.find(r => r.userId.toString() === userId.toString())
//   if (recipient) {
//     recipient.read = true
//     recipient.readAt = new Date()
//   }
//   return this.save()
// }

// module.exports = mongoose.model('Alert', alertSchema)


const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["spoilage", "expiry", "low_stock", "system", "donation"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved", "dismissed"],
      default: "active",
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acknowledgedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
    resolution: String,
    metadata: {
      spoilageRisk: Number,
      daysUntilExpiry: Number,
      quantity: Number,
      value: Number,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Alert", alertSchema)

