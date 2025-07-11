// const mongoose = require('mongoose')

// const donationSchema = new mongoose.Schema({
//   donationId: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   products: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: [1, 'Quantity must be at least 1']
//     },
//     estimatedValue: {
//       type: Number,
//       required: true,
//       min: [0, 'Value cannot be negative']
//     }
//   }],
//   ngo: {
//     ngoId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'NGO',
//       required: true
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     contact: {
//       name: String,
//       phone: String,
//       email: String
//     }
//   },
//   pickup: {
//     scheduled: {
//       type: Date,
//       required: true
//     },
//     actual: Date,
//     address: {
//       type: String,
//       required: true
//     },
//     instructions: String
//   },
//   status: {
//     type: String,
//     enum: ['scheduled', 'confirmed', 'picked_up', 'delivered', 'cancelled'],
//     default: 'scheduled',
//     index: true
//   },
//   totalValue: {
//     type: Number,
//     required: true,
//     min: [0, 'Total value cannot be negative']
//   },
//   totalQuantity: {
//     type: Number,
//     required: true,
//     min: [1, 'Total quantity must be at least 1']
//   },
//   storeId: {
//     type: String,
//     required: true,
//     index: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   notes: String,
//   receipt: {
//     issued: {
//       type: Boolean,
//       default: false
//     },
//     issuedAt: Date,
//     receiptNumber: String,
//     taxDeduction: {
//       eligible: {
//         type: Boolean,
//         default: true
//       },
//       amount: Number
//     }
//   },
//   feedback: {
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5
//     },
//     comment: String,
//     submittedAt: Date
//   }
// }, {
//   timestamps: true
// })

// // Generate donation ID before saving
// donationSchema.pre('save', function(next) {
//   if (this.isNew && !this.donationId) {
//     const date = new Date()
//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, '0')
//     const day = String(date.getDate()).padStart(2, '0')
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
//     this.donationId = `DON-${year}${month}${day}-${random}`
//   }
//   next()
// })

// // Calculate totals before saving
// donationSchema.pre('save', function(next) {
//   if (this.products && this.products.length > 0) {
//     this.totalQuantity = this.products.reduce((sum, product) => sum + product.quantity, 0)
//     this.totalValue = this.products.reduce((sum, product) => sum + product.estimatedValue, 0)
//   }
//   next()
// })

// module.exports = mongoose.model('Donation', donationSchema)

const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "collected", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    scheduledPickupDate: {
      type: Date,
    },
    collectedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    freshTrackData: {
      spoilageRisk: {
        type: Number,
        min: 0,
        max: 100,
      },
      estimatedMeals: {
        type: Number,
        min: 0,
      },
      environmentalImpact: {
        co2Saved: String,
        waterSaved: String,
      },
      taxBenefit: {
        type: String,
      },
      suitability: {
        suitable: Boolean,
        reason: String,
        confidence: Number,
        urgency: {
          type: String,
          enum: ["low", "medium", "high"],
        },
      },
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for efficient queries
donationSchema.index({ storeId: 1, status: 1 })
donationSchema.index({ ngoId: 1, status: 1 })
donationSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Donation", donationSchema)
