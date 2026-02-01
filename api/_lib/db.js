import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(uri, {
      bufferCommands: false,
    });

    cachedConnection = connection;
    console.log('MongoDB connected successfully');

    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
