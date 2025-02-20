"use server";

import { ObjectId } from "mongodb";
import {
  item_data,
  ProductCardProps,
  suggestionsProps,
  userProductData,
  userProductQuery,
} from "@/_common/types";
import client from "../db";
import { PAGE_SIZE } from "../constants";

// if (!MONGODB_URI) {
//   throw new Error("MongoDB connection string is undefined");
// }
// const client = new MongoClient(MONGODB_URI);

// Get latest Products
export async function getLatest(limit: number) {
  try {
    // await client.connect();
    const collection = client.db("testDB").collection<item_data>("items");

    const data = await collection
      .find<ProductCardProps>(
        {},
        {
          sort: { units_sold: -1 },
          projection: {
            _id: 1,
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
  }
  // finally {
  //   await client.close();
  // }
}

// Find single product
export async function findProduct(id: string) {
  try {
    // await client.connect();

    const collection = client.db("testDB").collection<item_data>("items");
    const product = await collection.findOne<item_data>(new ObjectId(id));

    return product;
  } catch (error) {
    console.log(error);
  }
  // finally {
  //   await client.close();
  // }
}

// Return autocomplete suggestions
export async function getAutocompleteSuggestions(query: string) {
  try {
    if (query.length > 3 && query !== undefined) {
      const collection = client.db("testDB").collection<item_data>("items");

      const data = await collection
        .find<suggestionsProps>(
          { item_name: { $regex: query, $options: "i" } },
          {
            projection: { item_name: 1 },
          }
        )
        .limit(5)
        .toArray();
      return JSON.stringify(data);
    }
    return JSON.stringify([]);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUserProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  user_id,
}: userProductQuery) {
  try {
    const pipeline = [
      {
        $search: {
          index: "user-products-index",
          text: {
            path: "user_id",
            query: user_id,
          },
        },
      },
      {
        $project: {
          _id: 1,
          item_name: 1,
          item_price: 1,
          category: 1,
          item_quantity: 1,
          average_rating: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ];

    const collection = client.db("testDB").collection<item_data>("items");

    const data = await collection.aggregate<{metadata: [{totalCount: number}], data: userProductData[]}>(pipeline).toArray();

    return JSON.stringify({
      data: data[0].data,
      totalPages: Math.ceil(data[0].metadata[0].totalCount / limit),
    });
  } catch (error) {
    console.log(error);
  }
}
