import { connect } from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

const connectToDB = async () => {
  await connect(MONGO_URI)
    .then((conn) => {
      console.log(`Connected to ${conn.connection.host}`);
    })
    .catch((e) => {
      console.log(e.message);
    });
};

export default connectToDB;
