import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global).mongoose || { conn: null, promise: null };

export const connectToDB = async () => {
  try {
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing');
    }

    if (!cached.promise) {
      cached.promise = await mongoose.connect(MONGODB_URI, {
        dbName: 'nails',
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;

    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
};
