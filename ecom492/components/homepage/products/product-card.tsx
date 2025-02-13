import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import ProductImage from "./product-image";

interface ProductProps {
    product: {
        item_name: string,
        item_image: string,
        average_rating: number,
        item_price: number,
        item_quantity: number
    }
}

const ProductCard = ({ product }: ProductProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/products/${product.item_name}`}>
            <ProductImage item_image={product.item_image} item_name={product.item_name} />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-4">
        <Link href={`/products/${product.item_name}`}>
          <h2 className="text-sm font-medium">{product.item_name.toUpperCase()}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.average_rating} stars</p>
          {product.item_quantity > 0 ? (
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
