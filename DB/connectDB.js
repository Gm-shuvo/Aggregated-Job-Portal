import mongoose from 'mongoose';

let connectionInstance = null;

// Connecting to the database
const connectDB = async (dbUrl) => {
  try {
    if (!connectionInstance) {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
      connectionInstance = mongoose.connection;
      console.log('Connected to the database successfully!');
    }
    return connectionInstance;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

export { connectDB };
