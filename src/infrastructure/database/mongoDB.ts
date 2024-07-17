// backend/src/infrastructure/database/mongoDB.ts



import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;

    const mongoURI = `mongodb://${username}:${password}@localhost:27017/Classroom`;

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};


// import mongoose from 'mongoose';

// export const connectDB = async () => {
  
//   try {
//     const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Classroom';
//     const conn = await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error : any) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1); // to terminate the Node.js process with an optional exit code.
//   }
// };


// conn.connection.host is the hostname or IP address of the MongoDB server

// useNewUrlParser: true: Ensures Mongoose uses the new URL parser.
// useUnifiedTopology: true: Enables the new server discovery and monitoring engine in MongoDB.
// useCreateIndex: true: Ensures Mongoose uses createIndex() instead of ensureIndex() for index building.

// `useUnifiedTopology: true` in MongoDB enables the use of a new server monitoring engine that improves scalability and reliability for database operations.