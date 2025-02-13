"use server";
import { MongoClient } from "mongodb";
import { MONGODB_URI } from "../constants";
import { item_data, ProductCardProps } from "@/_common/types";

if (!MONGODB_URI) {
  throw new Error("MongoDB connection string is undefined");
}
const client = new MongoClient(MONGODB_URI);

// Get latest Products
export async function getLatest(limit: number) {
  try {
    await client.connect();
    const collection = client.db("testDB").collection<item_data>("items");

    const data = await collection
      .find<ProductCardProps>(
        {},
        {
          sort: { units_sold: -1 },
          projection: {
            _id: 0,
            item_name: 1,
            item_image: 1,
            average_rating: 1,
            item_price: 1,
            item_quantity: 1,
          },
        }
      )
      .limit(limit)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}
