// backend/src/infrastructure/database/mongoDB.ts



import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const MONGO_URI= process.env.MONGO_URI; 
<<<<<<< HEAD
<<<<<<< HEAD
    // const username = process.env.MONGO_USER;
    // const password = process.env.MONGO_PASSWORD;

    // const mongoURI = `mongodb://${username}:${password}@localhost:27017/Classroom`;

=======

>>>>>>> parent of 756bf2e (notification added)
=======

>>>>>>> parent of 756bf2e (notification added)
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

