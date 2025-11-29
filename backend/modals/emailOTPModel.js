import mongoose from 'mongoose';

const emailOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired OTPs
emailOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailOTP = mongoose.model('EmailOTP', emailOTPSchema);

export default EmailOTP;