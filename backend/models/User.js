// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//     maxlength: [50, 'Name cannot exceed 50 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false
//   },
//   role: {
//     type: String,
//     enum: ['manager', 'staff', 'ngo', 'admin'],
//     default: 'staff'
//   },
//   storeId: {
//     type: String,
//     required: function() {
//       return this.role !== 'admin'
//     }
//   },
//   permissions: [{
//     type: String,
//     enum: [
//       'view_products',
//       'edit_products',
//       'delete_products',
//       'view_analytics',
//       'manage_donations',
//       'manage_users',
//       'system_admin'
//     ]
//   }],
//   profile: {
//     phone: String,
//     address: String,
//     avatar: String
//   },
//   preferences: {
//     notifications: {
//       email: {
//         type: Boolean,
//         default: true
//       },
//       sms: {
//         type: Boolean,
//         default: false
//       },
//       push: {
//         type: Boolean,
//         default: true
//       }
//     },
//     alertThresholds: {
//       spoilageRisk: {
//         type: Number,
//         default: 80,
//         min: 0,
//         max: 100
//       },
//       daysBeforeExpiry: {
//         type: Number,
//         default: 3,
//         min: 0
//       }
//     }
//   },
//   lastLogin: Date,
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date
// }, {
//   timestamps: true
// })

// // Encrypt password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next()
//   }
  
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   next()
// })

// // Generate JWT token
// userSchema.methods.getSignedJwtToken = function() {
//   return jwt.sign(
//     { id: this._id, role: this.role },
//     process.env.JWT_SECRET || 'freshtrack_secret_key',
//     { expiresIn: process.env.JWT_EXPIRE || '30d' }
//   )
// }

// // Match password
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

// // Set default permissions based on role
// userSchema.pre('save', function(next) {
//   if (this.isNew || this.isModified('role')) {
//     switch (this.role) {
//       case 'admin':
//         this.permissions = ['view_products', 'edit_products', 'delete_products', 'view_analytics', 'manage_donations', 'manage_users', 'system_admin']
//         break
//       case 'manager':
//         this.permissions = ['view_products', 'edit_products', 'view_analytics', 'manage_donations']
//         break
//       case 'staff':
//         this.permissions = ['view_products', 'edit_products']
//         break
//       case 'ngo':
//         this.permissions = ['view_products', 'manage_donations']
//         break
//       default:
//         this.permissions = ['view_products']
//     }
//   }
//   next()
// })

// module.exports = mongoose.model('User', userSchema)

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
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
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "ngo"],
      default: "staff",
    },
    storeId: {
      type: String,
      required: true,
    },
    profile: {
      phone: String,
      address: String,
      avatar: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    permissions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model("User", userSchema)

