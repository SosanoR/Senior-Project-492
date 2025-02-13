import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";

const ProductCard = ({ product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.item_image}
            alt={product.item_name}
            width={300}
            height={300}
            priority
          />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-4">
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.item_name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.average_rating} stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={product.item_price} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
