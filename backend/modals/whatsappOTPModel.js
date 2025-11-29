import mongoose from 'mongoose';

const whatsappOTPSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  expiry: {
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
whatsappOTPSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const WhatsAppOTP = mongoose.model('WhatsAppOTP', whatsappOTPSchema);

export default WhatsAppOTP;