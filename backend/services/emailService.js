import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email service not configured: EMAIL_USER and/or EMAIL_PASS not set');
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email transporter configuration error:', error);
        } else {
          console.log('✅ Email transporter is ready to send emails');
        }
      });
    } catch (error) {
      console.error('❌ Failed to create email transporter:', error);
      this.transporter = null;
    }
  }

  async sendOTP(email, otp) {
    // Check if transporter is available
    if (!this.transporter) {
      const errorMsg = 'Email service not configured properly. Check EMAIL_USER and EMAIL_PASS environment variables.';
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

      console.log(`📧 Sending OTP to ${email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      // Provide more specific error information
      let errorMessage = error.message;
      if (error.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Check your EMAIL_USER and EMAIL_PASS values.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection to email server refused. Check your network connection.';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Email server not found. Check your email service configuration.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

export default new EmailService();