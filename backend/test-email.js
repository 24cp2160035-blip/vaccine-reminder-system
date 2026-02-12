import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

console.log("=== Email Configuration Test ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Found (length: " + process.env.EMAIL_PASS.length + ")" : "✗ Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Server is ready to send emails");
    
    // Send a test email
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Vaccine App",
      text: "If you receive this, your email configuration is working correctly!",
      html: "<h2>Success!</h2><p>Your email configuration is working correctly.</p>"
    }, (err, info) => {
      if (err) {
        console.error("❌ Failed to send test email:", err.message);
        process.exit(1);
      } else {
        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
        process.exit(0);
      }
    });
  }
});
