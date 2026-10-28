import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`DB Connected successfully `);
  } catch (error) {
    console.log(`Error in DB Connection`, error);
  }
};

export default dbConnect;
