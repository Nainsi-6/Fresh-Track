// const mongoose = require("mongoose")

// const ngoSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "NGO name is required"],
//       trim: true,
//       maxlength: [100, "Name cannot exceed 100 characters"],
//     },
//     registrationNumber: {
//       type: String,
//       required: [true, "Registration number is required"],
//       unique: true,
//       trim: true,
//     },
//     type: {
//       type: String,
//       enum: ["food_bank", "shelter", "community_kitchen", "charity", "religious", "other"],
//       required: true,
//     },
//     contact: {
//       primary: {
//         name: {
//           type: String,
//           required: true,
//         },
//         phone: {
//           type: String,
//           required: true,
//         },
//         email: {
//           type: String,
//           required: true,
//           lowercase: true,
//         },
//       },
//       secondary: {
//         name: String,
//         phone: String,
//         email: String,
//       },
//     },
//     address: {
//       street: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: String,
//         required: true,
//       },
//       coordinates: {
//         latitude: Number,
//         longitude: Number,
//       },
//     },
//     capacity: {
//       dailyMeals: {
//         type: Number,
//         min: [0, "Daily meals cannot be negative"],
//       },
//       storageSpace: {
//         type: Number,
//         min: [0, "Storage space cannot be negative"],
//       },
//       refrigeration: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     preferences: {
//       acceptedCategories: [
//         {
//           type: String,
//           enum: ["Dairy", "Bakery", "Produce", "Meat", "Frozen", "Pantry"],
//         },
//       ],
//       pickupDays: [
//         {
//           type: String,
//           enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
//         },
//       ],
//       pickupTimes: {
//         start: String,
//         end: String,
//       },
//       minimumQuantity: {
//         type: Number,
//         default: 1,
//       },
//       maximumDistance: {
//         type: Number,
//         default: 50,
//       },
//     },
//     verification: {
//       status: {
//         type: String,
//         enum: ["pending", "verified", "rejected"],
//         default: "pending",
//       },
//       verifiedAt: Date,
//       verifiedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       documents: [
//         {
//           type: {
//             type: String,
//             enum: ["registration", "tax_exempt", "insurance", "other"],
//           },
//           filename: String,
//           url: String,
//           uploadedAt: {
//             type: Date,
//             default: Date.now,
//           },
//         },
//       ],
//     },
//     statistics: {
//       totalDonationsReceived: {
//         type: Number,
//         default: 0,
//       },
//       totalValueReceived: {
//         type: Number,
//         default: 0,
//       },
//       lastDonationDate: Date,
//       averageRating: {
//         type: Number,
//         min: 1,
//         max: 5,
//       },
//       totalRatings: {
//         type: Number,
//         default: 0,
//       },
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     notes: String,
//   },
//   {
//     timestamps: true,
//   },
// )

// // Index for location-based queries
// ngoSchema.index({ "address.coordinates": "2dsphere" })
// ngoSchema.index({ type: 1, isActive: 1 })
// ngoSchema.index({ "verification.status": 1 })

// // Method to calculate distance from a point
// ngoSchema.methods.distanceFrom = function (latitude, longitude) {
//   if (!this.address.coordinates.latitude || !this.address.coordinates.longitude) {
//     return null
//   }

//   const R = 6371 // Earth's radius in kilometers
//   const dLat = ((latitude - this.address.coordinates.latitude) * Math.PI) / 180
//   const dLon = ((longitude - this.address.coordinates.longitude) * Math.PI) / 180
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((this.address.coordinates.latitude * Math.PI) / 180) *
//       Math.cos((latitude * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//   return R * c
// }

// module.exports = mongoose.model("NGO", ngoSchema)


const mongoose = require("mongoose")

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    acceptedCategories: [
      {
        type: String,
        enum: ["dairy", "meat", "produce", "bakery", "frozen", "pantry", "beverages"],
        lowercase: true,
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 4.0,
        min: 1,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    totalDonationsReceived: {
      type: Number,
      default: 0,
    },
    lastDonationDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    capacity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    operatingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "17:00",
      },
    },
    specialRequirements: [String],
    contactPerson: {
      name: String,
      position: String,
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
ngoSchema.index({ acceptedCategories: 1, isActive: 1 })
ngoSchema.index({ "rating.average": -1 })

module.exports = mongoose.model("NGO", ngoSchema)
