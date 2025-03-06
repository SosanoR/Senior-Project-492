"use server";

import { ObjectId } from "mongodb";
import {
  data,
  insertionData,
  ProductCardProps,
  suggestionsProps,
  user_data,
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

// Get Best Selling Products
export async function getBestSelling(limit: number) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .find<ProductCardProps>({})
      .sort({  average_rating: -1 })
      .limit(limit)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Get latest Products
export async function getLatestProducts(limit: number) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .find<ProductCardProps>(
        {},
        {
          sort: { created_on: "desc" },
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

// Get products last viewed by user
export async function getLastViewedProducts(limit: number, user_id: string) {
  try {
    const userCollection = client.db("testDB").collection<user_data>("User");
    const user = { _id: new ObjectId(user_id) };
    const userExists = await userCollection.findOne(user);
    if (!userExists) {
      throw new Error("User not found.");
    }

    const ids = userExists.last_viewed.map((id) => {
      return new ObjectId(id);
    });

    const itemCollection = client.db("testDB").collection<data>("items");

    const data = await itemCollection
      .find<ProductCardProps>({ _id: { $in: ids } })
      .limit(limit)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Find single product by id
export async function findProduct(id: string) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const filter = {_id: new ObjectId(id)};

    const product = await collection.findOne<data>(filter);

    return product;
  } catch (error) {
    console.log(error);
  }
}

// Return autocomplete suggestions
export async function getAutocompleteSuggestions(query: string) {
  try {
    const MIN_QUERY_LENGTH = 2;
    if (query.length > MIN_QUERY_LENGTH && query !== undefined) {
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
    const initRating = Math.random();
    const rating = Number(
      (initRating >= 0.5 ? initRating * 5 : (initRating + 0.5) * 5).toFixed(1)
    );
    const sells = Number((Math.random() * 1000).toFixed(0));
    const reviewers = Number((Math.random() * sells).toFixed(0));

    await collection.insertOne({
      ...product,
      average_rating: rating,
      reviewer_count: reviewers,
      units_sold: sells,
      user_id: session_id,
      created_on: new Date(),
      last_modified: new Date(),
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
}

// Remove single Cloudinary image
export async function removeImage(image: string) {
  if (!image || "") {
    return;
  }
  await cloudinary.v2.api
    .delete_resources([image], {
      type: "upload",
      resource_type: "image",
    })
    .then(console.log);
}

// Remove multiple Cloudinary images
export async function removeImages(images: string[]) {
  if (!images || images.length === 0) {
    return;
  }
  await cloudinary.v2.api
    .delete_resources(images, {
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
