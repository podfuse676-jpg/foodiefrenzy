import userModel from "../modals/userModel.js";
import jwt from 'jsonwebtoken'
import bycrypt from 'bcrypt'
import validator from 'validator'
import { CartItem } from '../modals/cartItem.js';

// LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // CHECK IF USER IS AVAILABLE WITH THIS ID
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Doesn't Exist" })
        }

        // MATCHING USER AND PASSWORD
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        // Clear the user's cart on login to ensure fresh start
        await CartItem.deleteMany({ user: user._id });

        // IF PASSWORD MATCHES WE GENERATE TOKENS
        const token = createToken(user);
        res.json({ success: true, token })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const createToken = (user) => {
    // Ensure consistency with auth middleware
    const payload = { id: user._id, email: user.email, username: user.username };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// REGISTER USER
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // CHECKING IS USER ALREADY EXISTS
        const exists = await userModel.findOne({ email });
        if (exists) {
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
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt);

        // NEW USER 
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })
        // SAVE USER IN THE DATABASE
        const user = await newUser.save()

        // CREATE A TOKEN (ABOVE ||)AND SEND IT TO USER USING RESPONSE
        const token = createToken(user)
        res.json({ success: true, token })

    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser }