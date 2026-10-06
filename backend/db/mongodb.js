import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
   const mongoUri = process.env.MONGODB_URI_FASTCARE || process.env.MONGODB_URI;

   if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured');
   }

   const databaseName = process.env.MONGODB_DB_NAME || 'FastCare';
   await mongoose.connect(mongoUri, {
      dbName: databaseName,
      authSource: 'admin'
   });
   console.log(`MongoDB connected to ${mongoose.connection.name}`);
};

export default connectDB;
