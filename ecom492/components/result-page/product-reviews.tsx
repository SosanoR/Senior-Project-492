"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ReviewForm from "./products-review-form";
import { userReviews } from "@/_common/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DisplayStars from "../shared/display-stars";
import { getReviews } from "@/lib/actions/review.actions";
import { formatToTitleCase } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface ProductReviewsProps {
  user_id: string;
  user_name: string;
  product_id: string;
  user_review?: userReviews;
  // page?: number;
  id: string;
}

const ProductReviews = ({
  user_id,
  user_name,
  product_id,
  user_review,

}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<userReviews[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReviews(product_id, page);
      setReviews(res.data);
      setTotalPages(res.totalPages || 0);
    };
    fetchReviews();
  }, [product_id, submitted, page]);

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
            setSubmitted={setSubmitted}
            submitted={submitted}
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
              <CardTitle className="text-lg">
                {review.user_name
                  ? formatToTitleCase(review.user_name)
                  : "User"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm ">
                  {`Created on: ${new Date(
                    review.created_on
                  ).toLocaleDateString()}`}
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
            <CardFooter className="flex justify-end">
              {review.created_on !== review.last_modified && (
                <span className="text-sm text-gray-500">
                  {`Last modified on: ${new Date(
                    review.last_modified
                  ).toLocaleDateString()}`}
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `?page=${page - 1}` : `?page=1`}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href={`?${new URLSearchParams({ page: String(index + 1) })}`}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={
                  page !== totalPages
                    ? `?page=${page + 1}`
                    : `?page=${totalPages}`
                }
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductReviews;
