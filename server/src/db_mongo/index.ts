import mongoose from "mongoose";
import MongoStore from "connect-mongo";

let database: mongoose.Connection;

// constants
import { DB_MONGO_URI } from "../constants";

const mongo_store = MongoStore.create({ mongoUrl: DB_MONGO_URI });

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

export default { mongo_store, connectDB, disconnectDB };
