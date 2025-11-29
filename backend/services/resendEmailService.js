import { Resend } from 'resend';

class ResendEmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    
    // Check if API key is set
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  Resend email service not configured: RESEND_API_KEY not set');
    }
  }

  async sendOTP(email, otp) {
    // Check if service is configured
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: 'Resend email service not configured properly. Check RESEND_API_KEY environment variable.'
      };
    }

    try {
      const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;
      
      // Use a verified sender email address (you'll need to update this after verifying your domain)
      const fromEmail = process.env.FROM_EMAIL && !process.env.FROM_EMAIL.includes('lakeshoreconvenience.com') 
        ? process.env.FROM_EMAIL 
        : 'onboarding@resend.dev'; // This is a verified Resend domain that works for free accounts
      
      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Your OTP for Login - Lakeshore Convenience',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8BC34A; text-align: center;">Lakeshore Convenience</h2>
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; text-align: center;">
              <h3 style="color: #333;">Your One-Time Password</h3>
              <div style="font-size: 36px; font-weight: bold; color: #8BC34A; margin: 30px 0; letter-spacing: 5px;">
                ${otp}
              </div>
              <p style="color: #666; margin-bottom: 20px;">
                This OTP is valid for the next ${expiryMinutes} minutes. Please enter it in the login form to continue.
              </p>
              <p style="color: #999; font-size: 14px;">
                If you didn't request this OTP, please ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Lakeshore Convenience. All rights reserved.</p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('❌ Resend email error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ OTP email sent successfully via Resend:', data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Error sending OTP email via Resend:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ResendEmailService();