import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import ProductPrice from "@/_components/homepage/products/product-price";
import { findProduct } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductImages from "@/_components/result-page/product-images";

const ProductDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const product = await findProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Col */}
          <div className="col-span-2">
            <ProductImages images={product.item_image} />
          </div>
          {/* Details Col */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>Brand Category</p>
              <h1 className="h3-bold">{product.item_name}</h1>
              {/* Ratings count. Note fix the count later */}
              <p>
                {product.average_rating} stars from {product.units_sold}{" "}
                reviewers
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.item_price)}
                  className="w-24 rounded-full dark:bg-white dark:text-black bg-black text-white px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.item_description}</p>
            </div>
          </div>
          {/* Action col */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <ProductPrice value={Number(product.item_price)} />
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.item_quantity > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.item_quantity > 0 && (
                  <div className="flex-center">
                    <Button className="w-full">Add to Cart</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
