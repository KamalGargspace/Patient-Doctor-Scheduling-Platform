import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // Attach event listener for when mongoose connects successfully
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected (event listener)");
    });
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Log the connection details
    console.log(
      `MongoDB connected successfully to HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Terminate process on failure
  }
};

export default connectDB;
