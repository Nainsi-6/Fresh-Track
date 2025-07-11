// const mongoose = require('mongoose')

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true,
//     maxlength: [100, 'Product name cannot exceed 100 characters']
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: ['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen', 'Pantry'],
//     index: true
//   },
//   batch: {
//     type: String,
//     required: [true, 'Batch number is required'],
//     unique: true,
//     trim: true
//   },
//   dates: {
//     arrival: {
//       type: Date,
//       required: [true, 'Arrival date is required']
//     },
//     expiry: {
//       type: Date,
//       required: [true, 'Expiry date is required']
//     },
//     manufactured: {
//       type: Date
//     }
//   },
//   inventory: {
//     quantity: {
//       type: Number,
//       required: [true, 'Quantity is required'],
//       min: [0, 'Quantity cannot be negative']
//     },
//     unit: {
//       type: String,
//       default: 'units'
//     },
//     reserved: {
//       type: Number,
//       default: 0,
//       min: [0, 'Reserved quantity cannot be negative']
//     }
//   },
//   pricing: {
//     cost: {
//       type: Number,
//       required: [true, 'Cost price is required'],
//       min: [0, 'Cost cannot be negative']
//     },
//     retail: {
//       type: Number,
//       required: [true, 'Retail price is required'],
//       min: [0, 'Retail price cannot be negative']
//     },
//     discount: {
//       percentage: {
//         type: Number,
//         default: 0,
//         min: [0, 'Discount cannot be negative'],
//         max: [100, 'Discount cannot exceed 100%']
//       },
//       applied: {
//         type: Boolean,
//         default: false
//       },
//       appliedAt: Date
//     }
//   },
//   supplier: {
//     name: {
//       type: String,
//       required: [true, 'Supplier name is required']
//     },
//     contact: String,
//     email: String
//   },
//   storage: {
//     location: String,
//     temperature: {
//       type: Number,
//       default: 4
//     },
//     humidity: {
//       type: Number,
//       default: 65
//     },
//     conditions: {
//       type: String,
//       enum: ['optimal', 'acceptable', 'poor'],
//       default: 'optimal'
//     }
//   },
//   quality: {
//     freshness: {
//       type: Number,
//       min: [0, 'Freshness cannot be negative'],
//       max: [100, 'Freshness cannot exceed 100'],
//       default: 100
//     },
//     appearance: {
//       type: String,
//       enum: ['excellent', 'good', 'fair', 'poor'],
//       default: 'excellent'
//     },
//     lastInspected: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   predictions: {
//     spoilageRisk: {
//       type: Number,
//       min: [0, 'Risk cannot be negative'],
//       max: [100, 'Risk cannot exceed 100'],
//       default: 0
//     },
//     daysLeft: {
//       type: Number,
//       min: [0, 'Days left cannot be negative']
//     },
//     confidence: {
//       type: Number,
//       min: [0, 'Confidence cannot be negative'],
//       max: [100, 'Confidence cannot exceed 100']
//     },
//     lastPredicted: Date,
//     modelVersion: String
//   },
//   status: {
//     type: String,
//     enum: ['good', 'warning', 'critical', 'expired', 'sold', 'donated'],
//     default: 'good',
//     index: true
//   },
//   actions: {
//     discountApplied: {
//       type: Boolean,
//       default: false
//     },
//     donationScheduled: {
//       type: Boolean,
//       default: false
//     },
//     alertsSent: [{
//       type: {
//         type: String,
//         enum: ['email', 'sms', 'push', 'system']
//       },
//       sentAt: {
//         type: Date,
//         default: Date.now
//       },
//       recipient: String
//     }]
//   },
//   feedback: [{
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5
//     },
//     comment: String,
//     sentiment: {
//       type: String,
//       enum: ['positive', 'neutral', 'negative']
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   storeId: {
//     type: String,
//     required: [true, 'Store ID is required'],
//     index: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//     index: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// })

// // Virtual for days until expiry
// productSchema.virtual('daysUntilExpiry').get(function() {
//   if (!this.dates.expiry) return null
//   const now = new Date()
//   const expiry = new Date(this.dates.expiry)
//   const diffTime = expiry - now
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   return Math.max(0, diffDays)
// })

// // Virtual for available quantity
// productSchema.virtual('availableQuantity').get(function() {
//   return this.inventory.quantity - this.inventory.reserved
// })

// // Method to update status based on predictions and days left
// productSchema.methods.updateStatus = function() {
//   const daysLeft = this.daysUntilExpiry
//   const spoilageRisk = this.predictions.spoilageRisk || 0

//   if (daysLeft <= 0) {
//     this.status = 'expired'
//   } else if (spoilageRisk >= 80 || daysLeft <= 1) {
//     this.status = 'critical'
//   } else if (spoilageRisk >= 50 || daysLeft <= 3) {
//     this.status = 'warning'
//   } else {
//     this.status = 'good'
//   }
// }

// // Pre-save middleware to update status
// productSchema.pre('save', function(next) {
//   this.updateStatus()
//   next()
// })

// // Indexes for better query performance
// productSchema.index({ category: 1, status: 1 })
// productSchema.index({ 'dates.expiry': 1 })
// productSchema.index({ 'predictions.spoilageRisk': -1 })
// productSchema.index({ storeId: 1, isActive: 1 })

// module.exports = mongoose.model('Product', productSchema)


// const mongoose = require("mongoose")

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["dairy", "meat", "produce", "bakery", "frozen", "pantry", "beverages"],
//     },
//     batch: {
//       type: String,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     unit: {
//       type: String,
//       required: true,
//       enum: ["kg", "lbs", "pieces", "liters", "gallons"],
//     },
//     price: {
//       original: {
//         type: Number,
//         required: true,
//         min: 0,
//       },
//       current: {
//         type: Number,
//         required: true,
//         min: 0,
//       },
//       discountPercentage: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100,
//       },
//     },
//     dates: {
//       manufactured: {
//         type: Date,
//         required: true,
//       },
//       expiry: {
//         type: Date,
//         required: true,
//       },
//       received: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//     storage: {
//       temperature: Number,
//       humidity: Number,
//       location: String,
//     },
//     supplier: {
//       name: String,
//       contact: String,
//       address: String,
//     },
//     status: {
//       type: String,
//       enum: ["fresh", "warning", "critical", "expired"],
//       default: "fresh",
//     },
//     predictions: {
//       spoilageRisk: {
//         type: Number,
//         min: 0,
//         max: 100,
//         default: 0,
//       },
//       daysUntilSpoilage: Number,
//       confidence: Number,
//       lastPredicted: Date,
//     },
//     storeId: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     feedback: [
//       {
//         rating: {
//           type: Number,
//           min: 1,
//           max: 5,
//         },
//         comment: String,
//         date: {
//           type: Date,
//           default: Date.now,
//         },
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//       },
//     ],
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// // Update status based on expiry date and predictions
// productSchema.methods.updateStatus = function () {
//   const now = new Date()
//   const expiry = new Date(this.dates.expiry)
//   const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

//   if (daysUntilExpiry < 0) {
//     this.status = "expired"
//   } else if (daysUntilExpiry <= 1 || this.predictions.spoilageRisk > 80) {
//     this.status = "critical"
//   } else if (daysUntilExpiry <= 3 || this.predictions.spoilageRisk > 50) {
//     this.status = "warning"
//   } else {
//     this.status = "fresh"
//   }
// }

// // Pre-save middleware to update status
// productSchema.pre("save", function (next) {
//   this.updateStatus()
//   next()
// })

// module.exports = mongoose.model("Product", productSchema)'

const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["dairy", "meat", "produce", "bakery", "frozen", "pantry", "beverages"],
    },
    batch: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "lbs", "pieces", "liters", "gallons"],
    },
    price: {
      original: {
        type: Number,
        required: true,
        min: 0,
      },
      current: {
        type: Number,
        required: true,
        min: 0,
      },
      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    dates: {
      manufactured: {
        type: Date,
        required: true,
      },
      expiry: {
        type: Date,
        required: true,
      },
      received: {
        type: Date,
        default: Date.now,
      },
    },
    storage: {
      temperature: Number,
      humidity: Number,
      location: String,
    },
    supplier: {
      name: String,
      contact: String,
      address: String,
    },
    status: {
      type: String,
      enum: ["fresh", "warning", "critical", "expired"],
      default: "fresh",
    },
    predictions: {
      spoilageRisk: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      daysUntilSpoilage: Number,
      confidence: Number,
      lastPredicted: Date,
    },
    storeId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: [
      {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Update status based on expiry date and predictions
productSchema.methods.updateStatus = function () {
  const now = new Date()
  const expiry = new Date(this.dates.expiry)
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) {
    this.status = "expired"
  } else if (daysUntilExpiry <= 1 || this.predictions.spoilageRisk > 80) {
    this.status = "critical"
  } else if (daysUntilExpiry <= 3 || this.predictions.spoilageRisk > 50) {
    this.status = "warning"
  } else {
    this.status = "fresh"
  }
}

// Pre-save middleware to update status
productSchema.pre("save", function (next) {
  this.updateStatus()
  next()
})

module.exports = mongoose.model("Product", productSchema)

