// backend/src/infrastructure/database/mongoDB.ts



import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const MONGO_URI= process.env.MONGO_URI; 

    const mongoURI = `${MONGO_URI}/Classroom`;

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // version warnings
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

