import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/data');
    console.log('MongoDB Connected');
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};