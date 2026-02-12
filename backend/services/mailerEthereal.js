import nodemailer from "nodemailer";

console.log("-----------------------------------");
console.log("📧 Ethereal Email Service (Test Mode)");
console.log("-----------------------------------");

let transporter;

// Create Ethereal test account automatically
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('❌ Failed to create test account:', err);
    return;
  }

  console.log('✅ Ethereal Test Account Created:');
  console.log('📧 Email:', account.user);
  console.log('🔗 View emails at: https://ethereal.email/messages');
  console.log('-----------------------------------');

  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  // Override sendMail to log preview URL
  const originalSendMail = transporter.sendMail.bind(transporter);
  transporter.sendMail = async (mailOptions) => {
    const info = await originalSendMail(mailOptions);
    console.log('\n📧 Email Sent!');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('-----------------------------------\n');
    return info;
  };
});

// Wait a bit for transporter to be ready, then export
setTimeout(() => {}, 1000);

export default {
  sendMail: async (mailOptions) => {
    if (!transporter) {
      // Wait for transporter to be ready
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (transporter) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }
    return transporter.sendMail(mailOptions);
  },
  verify: (callback) => {
    if (transporter) {
      return transporter.verify(callback);
    }
    setTimeout(() => {
      if (transporter) {
        transporter.verify(callback);
      }
    }, 1000);
  }
};
