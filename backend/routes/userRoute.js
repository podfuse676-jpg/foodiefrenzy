import express from 'express'
import { loginUser, registerUser } from '../controllers/userController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import userModel from '../modals/userModel.js'
import bcrypt from 'bcryptjs'
import Order from '../modals/order.js'

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

// Get all users (admin only)
userRouter.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password').sort({ createdAt: -1 })
        res.json({ 
            success: true, 
            users,
            count: users.length
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" })
    }
})

// Add search users endpoint (admin only)
userRouter.get("/admin/users/search", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { query } = req.query;
        
        // If no query provided, return all users
        if (!query) {
            const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
            return res.json({ 
                success: true, 
                users,
                count: users.length
            });
        }
        
        // Search by name, email, phone number
        const users = await userModel.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phoneNumber: { $regex: query, $options: 'i' } }
            ]
        }).select('-password').sort({ createdAt: -1 });
        
        // Also search for orders with matching order IDs
        // Only do this if the query looks like it could be an ObjectId
        let additionalUsers = [];
        if (/^[0-9a-fA-F]{24}$/.test(query)) {
            try {
                const orders = await Order.find({
                    _id: query
                }).populate('user', 'username email phoneNumber');
                
                // Combine users from both searches, avoiding duplicates
                const userIds = new Set(users.map(user => user._id.toString()));
                additionalUsers = orders
                    .map(order => order.user)
                    .filter(user => user && !userIds.has(user._id.toString()));
            } catch (orderError) {
                console.error("Order search error:", orderError);
                // Continue with just user results if order search fails
            }
        }
            
        const allUsers = [...users, ...additionalUsers];
        
        res.json({ 
            success: true, 
            users: allUsers,
            count: allUsers.length
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ success: false, message: "Error searching users" });
    }
});

// Get user details including orders (admin only)
userRouter.get("/admin/users/:userId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate userId format to prevent conflicts with "search" keyword
        if (userId === 'search') {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        
        // Get user details
        const user = await userModel.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        
        // Get user's recent orders
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(20)
        
        res.json({ 
            success: true, 
            user,
            orders,
            ordersCount: orders.length
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user details" })
    }
})

// Get all orders (admin only)
userRouter.get("/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'username email phoneNumber').sort({ createdAt: -1 }).limit(100)
        res.json({ 
            success: true, 
            orders,
            count: orders.length
        })
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: "Error fetching orders" })
    }
})

// Get specific order details (admin only)
userRouter.get("/admin/orders/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params
        
        const order = await Order.findById(orderId).populate('user', 'username email phoneNumber')
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        
        res.json({ 
            success: true, 
            order
        })
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ success: false, message: "Error fetching order details" })
    }
})

export default userRouter