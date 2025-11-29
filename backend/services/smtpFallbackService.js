// SMTP Fallback Service - for environments where direct SMTP might be blocked
import nodemailer from 'nodemailer';

class SMTPFallbackService {
  constructor() {
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  SMTP Fallback service not configured: EMAIL_USER and/or EMAIL_PASS not set');
      this.transporter = null;
      return;
    }

    try {
      // Use a more compatible SMTP configuration for restricted environments
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000
      });
      
      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP Fallback transporter configuration error:', error);
          this.transporter = null;
        } else {
          console.log('✅ SMTP Fallback transporter is ready to send emails');
        }
      });
    } catch (error) {
      console.error('❌ Failed to create SMTP Fallback transporter:', error);
      this.transporter = null;
    }
  }

  async sendOTP(email, otp) {
    // Check if transporter is available
    if (!this.transporter) {
      const errorMsg = 'SMTP Fallback service not configured properly.';
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
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

      console.log(`📧 [SMTP Fallback] Sending OTP to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ [SMTP Fallback] OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ [SMTP Fallback] Error sending OTP email:', error);
      let errorMessage = error.message;
      if (error.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Check your EMAIL_USER and EMAIL_PASS values.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection to email server refused. Check your network connection.';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Email server not found. Check your email service configuration.';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'Connection timeout. This may be a network issue with the hosting provider.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

export default new SMTPFallbackService();