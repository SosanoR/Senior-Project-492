"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ReviewForm from "./products-review-form";
import { userReviews } from "@/_common/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DisplayStars from "../shared/display-stars";
import { getReviews } from "@/lib/actions/review.actions";


interface ProductReviewsProps {
  user_id: string;
  user_name: string;
  product_id: string;
  user_review?: userReviews;
}

const ProductReviews = ({
  user_id,
  user_name,
  product_id,
  user_review,
}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<userReviews[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReviews(product_id);
      setReviews(res);
    }
    fetchReviews();
  }, [product_id])

  return (
    <div className="space-y-5">
      {reviews.length === 0 && <div>No reviews yet, be the first!</div>}
      {user_id ? (
        <>
          <ReviewForm
            product_id={product_id}
            user_id={user_id}
            user_name={user_name}
            user_review={user_review}
          />
        </>
      ) : (
        <div>
          <div className="text-lg flex items-center justify-start">
            <p>Please</p>
            <Link href={`/login?callbackUrl=/result/${product_id}`}>
              <Button variant="outline" type="button" className="ml-2">
                Log in
              </Button>
            </Link>
            <p className="m-2">to leave a review.</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review._id.toString()} className="w-full">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-lg">{review.user_name ? review.user_name : "Deleted User"}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm ">
                  {new Date(review.created_on).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <p>Rating:</p>
                  <div className="flex items-center gap-0.5">
                    <DisplayStars rating={review.rating} />
                    <div className="mx-1">
                      <Button type="button" variant="outline">
                        {review.rating}
                      </Button>
                    </div>
                  </div>
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 text-foreground">
              {review.text}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
