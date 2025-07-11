// const express = require('express')
// const User = require('../models/User')
// const { protect, authorize, checkPermission } = require('../middleware/auth')
// const router = express.Router()

// // @route   GET /api/users
// // @desc    Get all users
// // @access  Private (Admin/Manager only)
// router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const { page = 1, limit = 20, role, storeId, search } = req.query

//     // Build filter
//     const filter = { isActive: true }
    
//     if (req.user.role === 'manager') {
//       filter.storeId = req.user.storeId
//     } else if (storeId) {
//       filter.storeId = storeId
//     }

//     if (role) filter.role = role
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ]
//     }

//     const skip = (page - 1) * limit
//     const users = await User.find(filter)
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))

//     const total = await User.countDocuments(filter)

//     res.json({
//       success: true,
//       data: {
//         users,
//         pagination: {
//           current: parseInt(page),
//           pages: Math.ceil(total / limit),
//           total,
//           limit: parseInt(limit)
//         }
//       }
//     })
//   } catch (error) {
//     console.error('Get users error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// // @route   PUT /api/users/:id
// // @desc    Update user
// // @access  Private (Admin/Manager only)
// router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       })
//     }

//     // Managers can only update users in their store
//     if (req.user.role === 'manager' && user.storeId !== req.user.storeId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this user'
//       })
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).select('-password')

//     res.json({
//       success: true,
//       message: 'User updated successfully',
//       data: { user: updatedUser }
//     })
//   } catch (error) {
//     console.error('Update user error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     })
//   }
// })

// module.exports = router

const express = require("express")
const User = require("../models/User")
const { protect, authorize, checkPermission } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, storeId, isActive = true, sortBy = "createdAt", sortOrder = "desc" } = req.query

    // Build filter object
    const filter = {}
    if (role) filter.role = role
    if (storeId) filter.storeId = storeId
    if (isActive !== undefined) filter.isActive = isActive === "true"

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort(sort).skip(skip).limit(Number.parseInt(limit)),
      User.countDocuments(filter),
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: Number.parseInt(limit),
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user fields (excluding password)
    const { password, ...updateData } = req.body
    Object.assign(user, updateData)

    await user.save()

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: { ...user.toObject(), password: undefined } },
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(400).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    })
  }
})

// @route   DELETE /api/users/:id
// @desc    Deactivate user (admin only)
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.isActive = false
    await user.save()

    res.json({
      success: true,
      message: "User deactivated successfully",
    })
  } catch (error) {
    console.error("Deactivate user error:", error)
    res.status(500).json({
      success: false,
      message: "Error deactivating user",
      error: error.message,
    })
  }
})

module.exports = router

