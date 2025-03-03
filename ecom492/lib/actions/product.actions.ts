"use server";

import { ObjectId } from "mongodb";
import {
  data,
  insertionData,
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
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
export async function createProduct(
  data: z.infer<typeof insertProductSchema>,
  session_id: string
) {
  try {
    const product = insertProductSchema.parse(data);

    const collection = client.db("testDB").collection<insertionData>("items");
    await collection.insertOne({
      ...product,
      average_rating: 0,
      units_sold: 0,
      user_id: session_id,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}

// Remove Cloudinary image
export async function removeImage(image: string) {
  await cloudinary.v2.api
    .delete_resources([image], {
      type: "upload",
      resource_type: "image",
    })
    .then(console.log);
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

    if (product._id !== productExists._id) {
      throw new Error("Invalid user");
    }

    await collection.updateOne(
      { _id: productExists._id },
      {
        $set: {
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          brand: product.brand,
          category: product.category,
          images: product.images,
          discount: product.discount,
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
  // query,
  limit = PAGE_SIZE,
  page,
  // category,
  user_id,
}: userProductQuery) {
  try {
    console.log(`user_id: ${user_id}`)
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
          category: 1,
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

    console.log(`items found: ${data[0].data.length}`);

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

    await cloudinary.v2.api
      .delete_resources(product.images, {
        type: "upload",
        resource_type: "image",
      })
      .then(console.log);

    await collection.deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}
