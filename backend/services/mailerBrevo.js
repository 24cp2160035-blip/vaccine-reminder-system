import nodemailer from "nodemailer";

console.log("-----------------------------------");
console.log("📧 Brevo (Sendinblue) Email Service");
console.log("-----------------------------------");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Brevo error:", error.message);
    console.log("💡 Get free account at: https://www.brevo.com/");
  } else {
    console.log("✅ Brevo service ready - 300 emails/day free");
  }
});

export default transporter;
