import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://hau20112003z:hau123@cluster0.goasa.mongodb.net/data?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};