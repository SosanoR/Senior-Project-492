import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/homepage/products/product-price";
import { findProduct } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductImages from "@/components/result-page/product-images";
import { auth } from "@/auth";
import { recordUserLastViewed } from "@/lib/actions/tracking.actions";
import DisplayStars from "@/components/shared/display-stars";
import ProductReviews from "@/components/result-page/product-reviews";
import { getUserReview } from "@/lib/actions/review.actions";
import CartAddButton from "@/components/result-page/product-add-cart";
import { findCart } from "@/lib/actions/cart.actions";

const ProductDetailsPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: string }>;
}) => {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const page = searchParams.page || "1";
  const currentPage = Number(page) || 1;
  const product = await findProduct(id);
  const session = await auth();
  let userReview;

  if (session) {
    if (session.user?.id) {
      await recordUserLastViewed(id, session.user.id);
    }
    userReview = await getUserReview(id);
  }

  const cart = await findCart();

  if (!product) {
    notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p className="text-lg">Brand: {product.brand}</p>
              <p className="text-lg">Category: {product.category}</p>
              <h1 className="h3-bold">{product.name}</h1>

              <div className="flex items-center gap-5">
                <Button variant="outline" className="hover:cursor-default">
                  {product.average_rating}
                </Button>

                <div className="flex gap-1">
                  <DisplayStars rating={product.average_rating} />
                </div>
                <p className="text-lg">{`from ${product.reviewer_count} reviewers.`}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center">
                <ProductPrice
                  value={Number(product.price)}
                  discount={product.discount}
                  className="w-[7rem] rounded-full dark:bg-white dark:text-black bg-black text-white px-5 py-2"
                />
                {(product.discount || product.discount > 0) && (
                  <p className="text-lg text-destructive w-[8rem] h-[3rem] rounded-full bg-green-500   text-white px-5 py-2">
                    {`Save ${product.discount}%`}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <div>{product.description}</div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <ProductPrice
                    value={
                      Number(product.price) * ((100 - product.discount) / 100)
                    }
                    className={product.discount > 0 ? "text-green-600" : ""}
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.quantity > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.quantity > 0 && (
                  <div className="flex-center">
                    <CartAddButton
                      cart={cart}
                      product={{
                        product_id: product._id.toString(),
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        discount: product.discount,
                        quantity: product.quantity,
                        image: product.images[0],
                        average_rating: product.average_rating,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="text-2xl">Customer Reviews</div>
        <ProductReviews
          user_id={session?.user?.id || ""}
          user_name={session?.user?.name || ""}
          user_review={userReview}
          product_id={product._id.toString()}
          id={id}
          page={currentPage}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
