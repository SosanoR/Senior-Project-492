import { MongoClient } from "mongodb";
import { MONGODB_URI } from "@/lib/constants/index";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}
const client = new MongoClient(MONGODB_URI);

async function run() {
    try {
      await client.connect();
      console.log("You successfully connected to MongoDB!");
      return client.db('testDB')
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }

export default run