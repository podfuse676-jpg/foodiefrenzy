// SendGrid email service - using official SendGrid SDK for better reliability
import sgMail from '@sendgrid/mail';

class SendGridEmailService {
  constructor() {
    // Check if SendGrid API key is set
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️  SendGrid email service not configured: SENDGRID_API_KEY not set');
      this.initialized = false;
      return;
    }

    try {
      // Set API key
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.initialized = true;
      console.log('✅ SendGrid email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SendGrid email service:', error);
      this.initialized = false;
    }
  }

  async sendOTP(email, otp) {
    // Check if service is initialized
    if (!this.initialized) {
      const errorMsg = 'SendGrid email service not configured properly. Check SENDGRID_API_KEY environment variable.';
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL || 'noreply@lakeshoreconvenience.com',
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
                This OTP is valid for the next ${(process.env.OTP_EXPIRY_MINUTES || 5)} minutes. Please enter it in the login form to continue.
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
      };

      console.log(`📧 [SendGrid] Sending OTP to ${email}...`);
      await sgMail.send(msg);
      console.log('✅ [SendGrid] OTP email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ [SendGrid] Error sending OTP email:', error);
      let errorMessage = error.message;
      
      if (error.response) {
        console.error('SendGrid API Response:', error.response.body);
        errorMessage = `SendGrid API error: ${error.response.body.errors ? error.response.body.errors[0].message : 'Unknown error'}`;
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

export default new SendGridEmailService();