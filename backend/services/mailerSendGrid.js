import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

console.log("-----------------------------------");
console.log("📧 SendGrid Email Service");
console.log("-----------------------------------");

// SendGrid configuration
const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
};

const transporter = nodemailer.createTransport(sgTransport(options));

// Verify connection
if (process.env.SENDGRID_API_KEY) {
  console.log("✅ SendGrid configured");
} else {
  console.log("⚠️ SENDGRID_API_KEY not found in .env");
  console.log("💡 Get free API key at: https://signup.sendgrid.com/");
}

export default transporter;
