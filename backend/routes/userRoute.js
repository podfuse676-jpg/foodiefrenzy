import express from 'express'
import { loginUser, registerUser } from '../controllers/userController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import userModel from '../modals/userModel.js'
import bcrypt from 'bcryptjs'

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

// Profile routes
userRouter.get("/profile", authMiddleware, async (req, res) => {
    try {
        // Get user data without password
        const user = await userModel.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching profile" })
    }
})

userRouter.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { username, email, phoneNumber } = req.body
        
        // Check if email is already taken by another user
        if (email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: req.user._id } })
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already in use" })
            }
        }
        
        // Check if phone number is already taken by another user
        if (phoneNumber) {
            const existingUser = await userModel.findOne({ phoneNumber, _id: { $ne: req.user._id } })
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Phone number already in use" })
            }
        }
        
        // Update user data
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { username, email, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password')
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        
        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating profile" })
    }
})

// Change password route
userRouter.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        
        // Get user with password
        const user = await userModel.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        
        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" })
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" })
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        
        // Update password
        user.password = hashedPassword
        await user.save()
        
        res.json({ success: true, message: "Password changed successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error changing password" })
    }
})

// Admin-only routes
userRouter.use("/admin", authMiddleware, adminMiddleware)
userRouter.get("/admin/users", async (req, res) => {
    // This is just a placeholder for admin routes
    res.json({ message: "Admin route accessed successfully" })
})

export default userRouter