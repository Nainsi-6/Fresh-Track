// const express = require('express')
// const bcrypt = require('bcryptjs')
// const User = require('../models/User')
// const { protect } = require('../middleware/auth')
// const router = express.Router()

// // @route   POST /api/auth/register
// // @desc    Register user
// // @access  Public
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, role, storeId } = req.body

//     // Check if user exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       })
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || 'staff',
//       storeId
//     })

//     // Generate token
//     const token = user.getSignedJwtToken()

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           storeId: user.storeId,
//           permissions: user.permissions
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Registration error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/auth/login
// // @desc    Login user
// // @access  Public
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password, role } = req.body

//     // Validate email & password
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an email and password'
//       })
//     }

//     // Check for user
//     const user = await User.findOne({ email }).select('+password')

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       })
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password)

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       })
//     }

//     // Check if user is active
//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'Account is deactivated'
//       })
//     }

//     // Update last login
//     user.lastLogin = new Date()
//     await user.save()

//     // Generate token
//     const token = user.getSignedJwtToken()

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           storeId: user.storeId,
//           permissions: user.permissions
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Login error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login',
//       error: error.message
//     })
//   }
// })

// // @route   GET /api/auth/me
// // @desc    Get current logged in user
// // @access  Private
// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)

//     res.json({
//       success: true,
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           storeId: user.storeId,
//           permissions: user.permissions,
//           profile: user.profile,
//           preferences: user.preferences,
//           lastLogin: user.lastLogin
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Get user error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   POST /api/auth/logout
// // @desc    Log user out / clear cookie
// // @access  Private
// router.post('/logout', protect, (req, res) => {
//   res.json({
//     success: true,
//     message: 'User logged out successfully'
//   })
// })

// module.exports = router


// const express = require("express")
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Register
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role, storeId, profile } = req.body

//     // Check if user already exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email",
//       })
//     }

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password,
//       role: role || "staff",
//       storeId: storeId || `STORE_${Date.now()}`,
//       profile: profile || {},
//     })

//     await user.save()

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           storeId: user.storeId,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Registration error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     })
//   }
// })

// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password, role } = req.body

//     // Find user by email
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       })
//     }

//     // Check password
//     const isPasswordValid = await user.comparePassword(password)
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       })
//     }

//     // Check if user is active
//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "Account is deactivated",
//       })
//     }

//     // Check role if provided
//     if (role && user.role !== role) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid role for this account",
//       })
//     }

//     // Update last login
//     user.lastLogin = new Date()
//     await user.save()

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

//     res.json({
//       success: true,
//       message: "Login successful",
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           storeId: user.storeId,
//           profile: user.profile,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Login error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//       error: error.message,
//     })
//   }
// })

// // Get current user profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       data: {
//         user: req.user,
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get user profile",
//       error: error.message,
//     })
//   }
// })

// // Logout
// router.post("/logout", auth, async (req, res) => {
//   try {
//     // In a real application, you might want to blacklist the token
//     res.json({
//       success: true,
//       message: "Logged out successfully",
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Logout failed",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, storeId, profile } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "staff",
      storeId: storeId || `STORE_${Date.now()}`,
      profile: profile || {},
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          storeId: user.storeId,
        },
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      })
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role for this account",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          storeId: user.storeId,
          profile: user.profile,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
})

// Get current user profile
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    })
  }
})

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    })
  }
})

module.exports = router

