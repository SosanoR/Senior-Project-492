"use server";

import { ObjectId } from "mongodb";
import client from "../db";
import { z } from "zod";
import { reviewFormSchemaInsert } from "../validators";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { userReviews, data } from "@/_common/types";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

export async function getReviews(product_id: string, page: number = 1) {
  try {
    const pipeline = [
      {
        $match: { product_id },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * PAGE_SIZE }, { $limit: PAGE_SIZE }],
        },
      },
    ];

    const reviews = await client
      .db("testDB")
      .collection<userReviews>("Review")
      .aggregate<{metadata: [{totalCount: number}], data: userReviews[]}>(pipeline)
      .toArray();

    return convertToPlainObject({
      data: reviews[0]?.data,
      totalPages:
        Math.ceil(reviews[0]?.metadata[0]?.totalCount / PAGE_SIZE) || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews.");
  }
}

export async function getUserReview(product_id: string) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      throw new Error("User is not logged in");
    }

    const user_id = session.user.id;

    const reviews = await client
      .db("testDB")
      .collection<userReviews>("Review")
      .findOne<userReviews>({ user_id, product_id });

    if (reviews === null) {
      return undefined;
    }
    return convertToPlainObject(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw new Error("Failed to fetch user reviews.");
  }
}

export async function createOrModifyReview(
  data: z.infer<typeof reviewFormSchemaInsert>
) {
  try {
    let type = "";

    const session = await auth();
    if (!session) {
      throw new Error("User is not authorized to make a review.");
    }

    const review = reviewFormSchemaInsert.parse(data);

    const product = await client
      .db("testDB")
      .collection<data>("items")
      .findOne({ _id: new ObjectId(review.product_id) });
    if (!product) {
      throw new Error("Product not found.");
    }

    const existingReview = await client
      .db("testDB")
      .collection<userReviews>("Review")
      .findOne({ user_id: review.user_id, product_id: review.product_id });

    if (existingReview) {
      await client
        .db("testDB")
        .collection<userReviews>("Review")
        .updateOne(
          { user_id: review.user_id, product_id: review.product_id },
          {
            $set: {
              user_name: review.user_name,
              text: review.text,
              rating: review.rating,
              last_modified: new Date(),
            },
          }
        );
      type = "updated";
    } else {
      await client
        .db("testDB")
        .collection("Review")
        .insertOne({
          ...review,
          created_on: new Date(),
          last_modified: new Date(),
        });
      type = "inserted";
    }

    // Update the product's average rating and reviewer count
    const reviews = await client
      .db("testDB")
      .collection("Review")
      .aggregate([
        { $match: { product_id: review.product_id } },
        {
          $group: {
            _id: null,
            average_rating: { $avg: "$rating" },
            reviewer_count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    if (reviews.length === 0) {
      throw new Error("No reviews found for this product.");
    }
    const averageRating = reviews[0].average_rating;
    const reviewerCount = reviews[0].reviewer_count;

    await client
      .db("testDB")
      .collection("items")
      .updateOne(
        { _id: new ObjectId(review.product_id) },
        {
          $set: {
            average_rating: averageRating,
            reviewer_count: reviewerCount,
          },
        }
      );

    revalidatePath(`/result/${review.product_id}`);

    return { success: true, message: `Review ${type} successfully.` };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, message: formatError(error) };
  }
}

interface DeleteReviewParams {
  user_id: string;
  product_id: string;
}

export async function deleteReview(data: DeleteReviewParams) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not authorized to delete a review.");
    }

    const session_id = session?.user?.id;

    if (session_id !== data.user_id) {
      throw new Error("User ID does not match the session user ID.");
    }

    await client
      .db("testDB")
      .collection<userReviews>("Review")
      .deleteOne({ user_id: session_id, product_id: data.product_id });

        const reviews = await client
        .db("testDB")
        .collection("Review")
        .aggregate([
          { $match: { product_id: data.product_id } },
          {
            $group: {
              _id: null,
              average_rating: { $avg: "$rating" },
              reviewer_count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const averageRating = reviews[0]?.average_rating || 0;
      const reviewerCount = reviews[0]?.reviewer_count || 0;

  
      await client
        .db("testDB")
        .collection("items")
        .updateOne(
          { _id: new ObjectId(data.product_id) },
          {
            $set: {
              average_rating: averageRating,
              reviewer_count: reviewerCount,
            },
          }
        );
  

    revalidatePath(`/result/${data.product_id}`);
    return { success: true, message: "Review deleted successfully." };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, message: formatError(error) };
  }
}
