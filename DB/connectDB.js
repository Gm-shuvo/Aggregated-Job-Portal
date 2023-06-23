import mongoose from 'mongoose';

// connecting to database
const connectDB = async (dbUrl) => {
    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to the database successfully!');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
}


export { connectDB };