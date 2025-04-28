import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import ProductImage from "./product-image";
import { ProductCardProps } from "@/_common/types";
import { formatToTitleCase } from "@/lib/utils";
import DisplayStars from "@/components/shared/display-stars";
import { Button } from "@/components/ui/button";

const ProductCard = ({
  _id,
  name,
  images,
  price,
  discount,
  quantity,
  average_rating,
}: ProductCardProps) => {
  const image_width = 300;
  const image_height = 300;

  return (
    <Card className="w-full max-w-sm">
      {(discount && discount > 0 ) ? (
        <div className="relative top-0 right-0 w-[5rem] bg-red-500 text-white p-1 rounded-md text-base font-bold ">
          {discount}% OFF
        </div>
      ): <div className="invisible m-2">hidden</div>}
      <CardHeader className=" p-2 items-center">
        <Link href={`/result/${_id}`}>
          <ProductImage
            images={images}
            name={name}
            width={image_width}
            height={image_height}
          />
        </Link>
      </CardHeader>

      <CardContent className=" p-4 grid gap-4">
        <Link href={`/result/${_id}`}>
          <h2 className="text-sm font-medium">{formatToTitleCase(name)}</h2>
        </Link>
        <div className="flex-between gap-4">
          <div className="flex gap-3 items-center">
            <Button variant="outline">{average_rating.toFixed(1)}</Button>
            <div className="flex gap-1">
              <DisplayStars rating={average_rating} />
            </div>
          </div>
          {quantity > 0 ? (
            <ProductPrice value={Number(price)} discount={discount} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
