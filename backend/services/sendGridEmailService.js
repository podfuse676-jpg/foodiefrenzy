// SendGrid email service - more reliable on hosting providers
import nodemailer from 'nodemailer';

class SendGridEmailService {
  constructor() {
    // Check if SendGrid API key is set
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️  SendGrid email service not configured: SENDGRID_API_KEY not set');
      this.transporter = null;
      return;
    }

    try {
      // SendGrid SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000
      });
      
      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SendGrid email transporter configuration error:', error);
          this.transporter = null;
        } else {
          console.log('✅ SendGrid email transporter is ready to send emails');
        }
      });
    } catch (error) {
      console.error('❌ Failed to create SendGrid email transporter:', error);
      this.transporter = null;
    }
  }

  async sendOTP(email, otp) {
    // Check if transporter is available
    if (!this.transporter) {
      const errorMsg = 'SendGrid email service not configured properly. Check SENDGRID_API_KEY environment variable.';
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@lakeshoreconvenience.com',
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
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ [SendGrid] OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ [SendGrid] Error sending OTP email:', error);
      let errorMessage = error.message;
      if (error.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Check your SENDGRID_API_KEY.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection to SendGrid refused. Check your network connection.';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'SendGrid server not found. Check your configuration.';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'Connection timeout. This may be a network issue.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

export default new SendGridEmailService();