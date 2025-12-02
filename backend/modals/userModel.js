import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    isPhoneVerified: { type: Boolean, default: false },
    phoneVerificationCode: { type: String },
    phoneVerificationExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Add role field
})

// Add indexes for better query performance
// Index on email for faster login lookups
// userSchema.index({ email: 1 }); // Removed to avoid duplicate index

// Index on phoneNumber for faster phone login lookups
// userSchema.index({ phoneNumber: 1 }); // Removed to avoid duplicate index

// Index on phone verification fields for faster verification queries
userSchema.index({ phoneVerificationCode: 1, phoneVerificationExpires: 1 });

// Ensure the model is registered with the correct name
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;