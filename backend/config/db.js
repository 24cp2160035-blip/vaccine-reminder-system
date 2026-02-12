import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Add database name if not present
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    
    // Add database name if missing
    if (!mongoUri.includes('?') && !mongoUri.split('/').pop()) {
      mongoUri = mongoUri + 'vaccine-reminder';
    }
    
    console.log(`Attempting to connect to MongoDB...`);
    console.log(`URI format check: ${mongoUri.includes('mongodb+srv://') ? '✓' : '✗'}`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 30 second timeout for Render
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(`   Error: ${error.message}`);
    console.error(`   Name: ${error.name}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('   → DNS resolution failed. Check your MongoDB URI.');
    } else if (error.message.includes('authentication failed')) {
      console.error('   → Authentication failed. Check username/password.');
    } else if (error.message.includes('timed out')) {
      console.error('   → Connection timed out. Check MongoDB Atlas IP whitelist.');
      console.error('   → Make sure 0.0.0.0/0 is whitelisted in Network Access.');
    }
    
    throw error;
  }
};

export default connectDB;