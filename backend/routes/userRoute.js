import express from 'express'
import { loginUser, registerUser } from '../controllers/userController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

// Admin-only routes
userRouter.use("/admin", authMiddleware, adminMiddleware)
userRouter.get("/admin/users", async (req, res) => {
    // This is just a placeholder for admin routes
    res.json({ message: "Admin route accessed successfully" })
})

export default userRouter;