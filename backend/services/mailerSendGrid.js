import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

console.log("-----------------------------------");
console.log("📧 SendGrid Email Service");
console.log("-----------------------------------");

const apiKey = process.env.SENDGRID_API_KEY?.trim();
const fromEmail = process.env.EMAIL_USER?.trim();

console.log("SendGrid API Key:", apiKey ? "✓ Found" : "✗ Missing");
console.log("From Email:", fromEmail);

if (!apiKey) {
  console.error("❌ ERROR: SENDGRID_API_KEY not found in environment variables!");
  console.error("Get your API key from: https://app.sendgrid.com/settings/api_keys");
}

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

// Create a transporter-like interface to match nodemailer
const transporter = {
  sendMail: async ({ from, to, subject, text, html }) => {
    try {
      const msg = {
        to,
        from: from || fromEmail,
        subject,
        text,
        html: html || text,
      };
      
      const response = await sgMail.send(msg);
      console.log(`✅ Email sent via SendGrid to ${to}`);
      return { messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ SendGrid error:', error.message);
      if (error.response) {
        console.error('Response body:', error.response.body);
      }
      throw error;
    }
  },
  
  verify: async () => {
    // SendGrid doesn't have a verify method, so we just check if API key is set
    if (!apiKey) {
      throw new Error('SendGrid API key not configured');
    }
    return true;
  }
};

// Test connection
if (apiKey) {
  console.log("✅ SendGrid service ready - Emails will be sent from", fromEmail);
} else {
  console.log("⚠️  SendGrid not configured - emails will fail");
}

export default transporter;
