"use server";

import { ObjectId } from "mongodb";
import {
  data,
  ProductCardProps,
  suggestionsProps,
  userProductData,
  userProductQuery,
} from "@/_common/types";
import client from "../db";
import { PAGE_SIZE } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

// Get latest Products
export async function getLatest(limit: number) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .find<ProductCardProps>(
        {},
        {
          sort: { units_sold: -1 },
          projection: {
            _id: 1,
            name: 1,
            images: 1,
            average_rating: 1,
            price: 1,
            quantity: 1,
          },
        }
      )
      .limit(limit)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Find single product
export async function findProduct(id: string) {
  try {
    // await client.connect();

    const collection = client.db("testDB").collection<data>("items");
    const product = await collection.findOne<data>(new ObjectId(id));

    return product;
  } catch (error) {
    console.log(error);
  }
}

// Return autocomplete suggestions
export async function getAutocompleteSuggestions(query: string) {
  try {
    if (query.length > 3 && query !== undefined) {
      const collection = client.db("testDB").collection<data>("items");

      const data = await collection
        .find<suggestionsProps>(
          { name: { $regex: query, $options: "i" } },
          {
            projection: { name: 1 },
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

// Create a user product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    const collection = client.db("testDB").collection<data>("items");
    await collection.insertOne(product);

    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}

// Update a user product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const collection = client.db("testDB").collection<data>("items");
    const productExists = await collection.findOne({
      _id: new ObjectId(product._id),
    });

    if (!productExists) {
      throw new Error("Product not found.");
    }

    await collection.updateOne(
      { _id: productExists._id },
      {
        $set: {
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          price: Number(product.price),
          brand: product.brand,
          categories: product.categories,
          images: product.images,
        },
      }
    );

    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}

// Return user's products
export async function getAllUserProducts({
  query,
  limit = PAGE_SIZE,
  page,
  categories,
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
          name: 1,
          price: 1,
          categories: 1,
          quantity: 1,
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

    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .aggregate<{
        metadata: [{ totalCount: number }];
        data: userProductData[];
      }>(pipeline)
      .toArray();

    if (data[0].data.length > 0) {
      return JSON.stringify({
        data: data[0].data,
        totalPages: Math.ceil(data[0].metadata[0].totalCount / limit),
      });
    }
    return undefined;
  } catch (error) {
    console.log(error);
  }
}

// Delete user's product
export async function deleteUserProduct(id: string) {
  try {
    const collection = client.db("testDB").collection<data>("items");
    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      throw new Error("Product does not exist.");
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}
