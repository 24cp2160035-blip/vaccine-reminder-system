import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

console.log("-----------------------------------");
console.log("📧 SendGrid Email Service");
console.log("-----------------------------------");

const apiKey = process.env.SENDGRID_API_KEY?.trim();
const fromEmail = process.env.EMAIL_USER?.trim();

console.log("SendGrid API Key:", apiKey ? `✓ Found (${apiKey.substring(0, 10)}...)` : "✗ Missing");
console.log("API Key Length:", apiKey?.length || 0);
console.log("From Email:", fromEmail);

if (!apiKey) {
  console.error("❌ ERROR: SENDGRID_API_KEY not found in environment variables!");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('SEND')));
}

if (apiKey) {
  try {
    sgMail.setApiKey(apiKey);
    console.log("✅ SendGrid API key set successfully");
  } catch (error) {
    console.error("❌ Error setting SendGrid API key:", error.message);
  }
}

// Create a transporter-like interface to match nodemailer
const transporter = {
  sendMail: async ({ from, to, subject, text, html }) => {
    if (!apiKey) {
      throw new Error('SendGrid API key not configured');
    }
    
    try {
      console.log(`📤 Sending email via SendGrid...`);
      console.log(`   From: ${from || fromEmail}`);
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      
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
      console.error('Error code:', error.code);
      if (error.response) {
        console.error('Response status:', error.response.statusCode);
        console.error('Response body:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  },
  
  verify: async () => {
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
