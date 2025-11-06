import userModel from "../modals/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../modals/userModel.js'
import { CartItem } from '../modals/cartItem.js'
import asyncHandler from 'express-async-handler'

// LOGIN USER
const loginUser = async (req, res) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Login request received');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { email, password } = req.body;
    try {
        console.log('Login attempt for email:', email);
        
        // CHECK IF USER IS AVAILABLE WITH THIS ID
        const user = await userModel.findOne({ email });
        console.log('User lookup result:', user ? 'Found' : 'Not found');
        
        if (!user) {
            console.log('User not found in database for email:', email);
            return res.json({ success: false, message: "User Doesn't Exist" })
        }

        console.log('User found:', user.username, user.email, user.role);
        
        // MATCHING USER AND PASSWORD
        console.log('Comparing password...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        // Clear the user's cart on login to ensure fresh start
        console.log('Clearing user cart...');
        try {
            await CartItem.deleteMany({ user: user._id });
            console.log('Cart cleared successfully');
        } catch (cartError) {
            console.log('Error clearing cart:', cartError);
        }

        // IF PASSWORD MATCHES WE GENERATE TOKENS
        console.log('Generating token...');
        const token = createToken(user);
        console.log('Login successful for user:', user.email);
        res.json({ success: true, token, role: user.role })
    }
    catch (error) {
        console.log('=== LOGIN ERROR ===');
        console.log('Login error:', error);
        console.log('Error stack:', error.stack);
        res.json({ success: false, message: "Error" })
    }
}

const createToken = (user) => {
    // Ensure consistency with auth middleware
    const payload = { id: user._id, email: user.email, username: user.username, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// REGISTER USER
const registerUser = async (req, res) => {
    const { username, password, email, role } = req.body;  // Add role to destructuring
    try {
        console.log('Registration attempt for email:', email, 'with role:', role);
        
        // CHECKING IS USER ALREADY EXISTS
        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log('User already exists with email:', email);
            return res.json({ success: false, message: "User Already Exists" })
        }

        // VALIDATING EMAIL FORMAT AND STRONG PASSWORD
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter A Valid Email" })
        }

        // PASSWORD IS STRONG 
        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter A Strong Password" })
        }

        // HASING USER PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // NEW USER 
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword,
            role: role || 'user'  // Use provided role or default to 'user'
        })
        // SAVE USER IN THE DATABASE
        const user = await newUser.save()
        console.log('User registered successfully:', user.email, 'with role:', user.role);

        // CREATE A TOKEN (ABOVE ||)AND SEND IT TO USER USING RESPONSE
        const token = createToken(user)
        res.json({ success: true, token, role: user.role })

    }

    catch (error) {
        console.log('Registration error:', error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser, createToken }
