import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

console.log("-----------------------------------");
console.log("📧 Gmail Email Service");
console.log("-----------------------------------");

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.trim();

console.log("Email User:", emailUser);
console.log("Email Pass:", emailPass ? "✓ Found" : "✗ Missing");
console.log("Email Pass Length:", emailPass?.length);

if (!emailUser || !emailPass) {
  console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS not found in environment variables!");
  console.error("Make sure your .env file is in the backend folder and contains:");
  console.error("EMAIL_USER=your-email@gmail.com");
  console.error("EMAIL_PASS=your-app-password");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false // Helps with local network issues
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Gmail authentication failed:", error.message);
    console.log("💡 Check your App Password at https://myaccount.google.com/apppasswords");
  } else {
    console.log("✅ Gmail service ready - Real emails will be sent to", emailUser);
  }
});

export default transporter;