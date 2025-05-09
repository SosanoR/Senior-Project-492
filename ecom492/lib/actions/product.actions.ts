"use server";

import { ObjectId } from "mongodb";
import {
  data,
  insertionData,
  ProductCardProps,
  productFilterQuery,
  ProductResultsCardProps,
  suggestionsProps,
  user_data,
  userProductData,
  userProductQuery,
} from "@/_common/types";
import client from "../db";
import { AUTOCOMPLETE_SEARCH_LIMIT, PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import cloudinary from "cloudinary";
import { filteringParamsSchema } from "../validators";

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
      .sort({ average_rating: -1 })
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

// Get Best Selling Electronics Products
export async function getBestSellingElectronics(limit: number) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const pipeline = [
      {
        $search: {
          index: "user-products-index",
          text: {
            query: "Electronics",
            path: "category",
            fuzzy: { maxEdits: 2, prefixLength: 2 },
          },
        },
      },
    ];

    const data = await collection
      .aggregate<ProductCardProps>(pipeline)
      .sort({ average_rating: -1 })
      .limit(limit)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Get Top Discounts Products
export async function getTopDiscounts(limit: number) {
  try {
    const collection = client.db("testDB").collection<data>("items");

    const pipeline = [
      {
        $match: {
          discount: { $gt: 0 },
        },
      },
      {
        $sort: { discount: -1, average_rating: -1 },
      },
      {
        $limit: limit,
      },
    ];

    const data = await collection
      .aggregate<ProductCardProps>(pipeline)
      .toArray();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Get products last viewed by user
export async function getLastViewedProducts(limit: number, user_id: string) {
  try {
    const collection = client.db("testDB").collection<user_data>("User");
    const user = { _id: new ObjectId(user_id) };
    const userExists = await collection.findOne(user);
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

    const filter = { _id: new ObjectId(id) };

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

      const pipeline = [
        {
          $search: {
            index: "autocomplete",
            compound: {
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "name",
                    fuzzy: { maxEdits: 2, prefixLength: 2 },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "brand",
                    fuzzy: { maxEdits: 2, prefixLength: 2 },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "category",
                    fuzzy: { maxEdits: 2, prefixLength: 2 },
                  },
                },
              ],
            },
          },
        },
        {
          $limit: AUTOCOMPLETE_SEARCH_LIMIT,
        },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ];

      const data = await collection
        .aggregate<suggestionsProps>(pipeline)
        .toArray();

      return convertToPlainObject(data);
    }
    return undefined;
  } catch (error) {
    console.log(error);
    return [];
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

    const sells = Number((Math.random() * 1000).toFixed(0));

    await collection.insertOne({
      ...product,
      average_rating: 0,
      reviewer_count: 0,
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
export async function updateProduct(
  data: z.infer<typeof updateProductSchema>,
  user_id: string
) {
  try {
    const product = updateProductSchema.parse(data);
    const collection = client.db("testDB").collection<data>("items");
    const productExists = await collection.findOne({
      _id: new ObjectId(product._id),
    });

    if (!productExists) {
      throw new Error("Product not found.");
    }

    if (
      product._id !== productExists._id.toString() ||
      productExists.user_id !== user_id
    ) {
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
          last_modified: new Date(),
        },
      }
    );

    revalidatePath("/admin/products");
    return { success: true, message: "Product updated successfully." };
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
  user_id,
}: userProductQuery) {
  try {
    const pipeline = [];

    // Optional filters
    if (query) {
      pipeline.push({
        $search: {
          index: "itemsDB",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "name",
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                },
              },
              {
                text: {
                  query: query,
                  path: "brand",
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                },
              },
              {
                text: {
                  query: query,
                  path: "category",
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                },
              },
            ],
          },
        },
      });
    }

    const manditoryFilters = [
      {
        $match: {
          user_id: user_id,
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

    // const pipeline1 = [
    //   {
    //     $search: {
    //       index: "user-products-index",
    //       text: {
    //         path: "user_id",
    //         query: user_id,
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       name: 1,
    //       price: 1,
    //       category: 1,
    //       quantity: 1,
    //       average_rating: 1,
    //     },
    //   },
    //   {
    //     $facet: {
    //       metadata: [{ $count: "totalCount" }],
    //       data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
    //     },
    //   },
    // ];

    pipeline.push(...manditoryFilters);

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

// Get all search results
export async function getAllSearchResults({
  query,
  limit,
  page,
  brand,
  category,
  min,
  max,
  sort,
}: productFilterQuery) {
  try {
    const pageFilters = { query, limit, page, brand, category, min, max, sort };
    const filters = filteringParamsSchema.safeParse(pageFilters);

    if (!filters.success) {
      throw new Error(filters.error.errors[0].message);
    }

    const filteringPipeline = [];

    const queryFilters = {
      $search: {
        index: "itemsDB",
        compound: {
          should: [
            {
              text: {
                query: query,
                path: "name",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
            {
              text: {
                query: query,
                path: "brand",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
            {
              text: {
                query: query,
                path: "category",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
          ],
        },
      },
    };

    filteringPipeline.push(queryFilters);

    const matchStage: {
      brand?: { $regex: string; $options: string };
      category?: { $regex: string; $options: string };
      price?: { $gte?: number; $lte?: number };
    } = {};

    if (brand) {
      matchStage.brand = { $regex: brand, $options: "i" };
    }
    if (category) {
      matchStage.category = { $regex: category, $options: "i" };
    }
    if (min) {
      matchStage.price = { ...matchStage.price, $gte: Number(min) };
    }
    if (max && (!min || Number(min) <= Number(max))) {
      matchStage.price = { ...matchStage.price, $lte: Number(max) };
    }

    if (Object.keys(matchStage).length > 0) {
      filteringPipeline.push({ $match: matchStage });
    }

    if (sort) {
      if (sort === "price-l-h") {
        filteringPipeline.push({ $sort: { price: 1, _id: 1 } });
      } else if (sort === "price-h-l") {
        filteringPipeline.push({ $sort: { price: -1, _id: 1 } });
      } else if (sort === "rating-l-h") {
        filteringPipeline.push({ $sort: { average_rating: 1, _id: 1 } });
      } else if (sort === "rating-h-l") {
        filteringPipeline.push({ $sort: { average_rating: -1, _id: 1 } });
      }
    }

    const manditoryFilters = [
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          category: 1,
          brand: 1,
          average_rating: 1,
          images: 1,
          quantity: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ];

    filteringPipeline.push(...manditoryFilters);

    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .aggregate<{
        metadata: [{ totalCount: number }];
        data: ProductResultsCardProps[];
      }>(filteringPipeline)
      .toArray();

    if (data[0].data.length > 0) {
      return JSON.stringify({
        data: data[0].data,
        totalPages: Math.ceil(data[0].metadata[0].totalCount / limit),
        totalFound: data[0].metadata[0].totalCount,
      });
    }

    return undefined;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductFilters(query: string) {
  try {
    const filterPipeline = [];

    const queryFilters = {
      $search: {
        index: "itemsDB",
        compound: {
          should: [
            {
              text: {
                query: query,
                path: "name",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
            {
              text: {
                query: query,
                path: "brand",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
            {
              text: {
                query: query,
                path: "category",
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
          ],
        },
      },
    };

    filterPipeline.push(queryFilters);
    const collection = client.db("testDB").collection<data>("items");

    const data = await collection
      .aggregate<ProductResultsCardProps>(filterPipeline)
      .toArray();

    const categories = new Set<string>();
    const brands = new Set<string>();
    for (const item of data) {
      const itemCategories = item.category.split(/[-\s,]+/);
      brands.add(item.brand.toLowerCase().trim());
      for (const cata of itemCategories) {
        categories.add(cata);
      }
    }

    if (data.length > 0) {
      return convertToPlainObject({
        categories: Array.from(categories.values()),
        brands: Array.from(brands.values()),
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
