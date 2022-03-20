import mongoose from "mongoose";
let database: mongoose.Connection;

// constants
import { DB_MONGO_URI } from "../constants";

const connectDB = async () => {
  if (database) {
    console.log(database);
    return;
  }

  await mongoose.connect(DB_MONGO_URI, {}, (error) => {
    if (error) {
      console.log("Connect database failed with error: ", error);
    } else {
      console.log("Connected to database");
      database = mongoose.connection;
    }
  });
};

const disconnectDB = async () => {
  if (!database) {
    return;
  }

  await mongoose.disconnect();
};

export default { connectDB, disconnectDB };
