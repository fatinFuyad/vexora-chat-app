import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async function() {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL.replace(
        "<db_password>",
        process.env.DATABASE_PASSWORD
      )
    );

    // console.log(`database for ${connectObj.connections[0].name}: ${connectObj.connections[0].port}` );
    console.log("DATABASE CONNECTED SUCCESSFULLY 💽");
  } catch (error) {
    process.exit(1);
  }
};
