import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessId = process.env.WHATSAPP_BUSINESS_ID;
    this.templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'otp_template';
    
    // Check if required environment variables are set
    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('⚠️  WhatsApp service not fully configured: missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    }
  }

  /**
   * Send OTP via WhatsApp using Meta Cloud API
   * @param {string} to - Recipient phone number in international format (e.g., +1234567890)
   * @param {string} otp - 6-digit OTP to send
   * @returns {Promise<Object>} - Result of the API call
   */
  async sendOTP(to, otp) {
    // Validate environment variables
    if (!this.accessToken || !this.phoneNumberId) {
      return {
        success: false,
        error: 'WhatsApp service not configured properly. Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID.'
      };
    }

    try {
      // Format the phone number (remove spaces, dashes, etc.)
      const formattedPhoneNumber = this.formatPhoneNumber(to);
      
      // Calculate expiry time
      const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;
      
      // Construct the message
      const message = `Your OTP for Lakeshore Convenience is: ${otp}. Valid for ${expiryMinutes} minutes.`;

      // Prepare the API request
      const url = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhoneNumber,
        text: {
          body: message
        }
      };

      const headers = {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      };

      console.log(`📧 Sending WhatsApp OTP to ${formattedPhoneNumber}...`);
      
      // Send the request
      const response = await axios.post(url, payload, { headers });
      
      console.log('✅ WhatsApp OTP sent successfully:', response.data);
      
      return {
        success: true,
        messageId: response.data?.messages?.[0]?.id
      };
    } catch (error) {
      console.error('❌ Error sending WhatsApp OTP:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to send WhatsApp OTP';
      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = `WhatsApp API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from WhatsApp API';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Format phone number to international format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let formatted = phoneNumber.replace(/\D/g, '');
    
    // If it starts with a single zero, assume it's a local number and needs country code
    // You might want to adjust this logic based on your target audience
    if (formatted.startsWith('0')) {
      formatted = formatted.substring(1);
    }
    
    // If it doesn't start with + or a country code, prepend +
    if (!formatted.startsWith('+') && formatted.length > 10) {
      formatted = `+${formatted}`;
    }
    
    return formatted;
  }
}

export default new WhatsAppService();