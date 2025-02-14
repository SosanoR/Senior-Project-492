import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import ProductImage from "./product-image";
import { ProductCardProps } from "@/_common/types";
import { formatToTitleCase } from "@/lib/utils";

const ProductCard = ({
  _id,
  item_name,
  item_image,
  item_price,
  item_quantity,
  average_rating,
}: ProductCardProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/result/${_id}`}>
          <ProductImage item_image={item_image} item_name={item_name} />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-4">
        <Link href={`/result/${_id}`}>
          <h2 className="text-sm font-medium">{formatToTitleCase(item_name)}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{average_rating} stars</p>
          {item_quantity > 0 ? (
            <ProductPrice value={item_price} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
