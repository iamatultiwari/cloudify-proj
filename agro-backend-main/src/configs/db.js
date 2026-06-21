import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Support both common env var names
    const { MONGO_URI, MONGODB_URI } = process.env;
    const uri = MONGO_URI || MONGODB_URI;

    if (!uri) {
      console.error(
        "Database Error: Missing environment variable MONGO_URI (or MONGODB_URI). " +
          "Set it in backend/.env (e.g., MONGO_URI=mongodb+srv://...)."
      );
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
