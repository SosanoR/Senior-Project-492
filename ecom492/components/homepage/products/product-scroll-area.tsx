import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "./product-card";
import { ProductCardProps } from "@/_common/types";
import Link from "next/link";

interface ProductScrollAreaProps {
  title: string;
  products?: ProductCardProps[];
}

const ProductScrollArea = async ({
  title,
  products,
}: ProductScrollAreaProps) => {
  return (
    <>
      <h2 className="h2-bold mb-4">{title}</h2>
      <ScrollArea className="w-full  whitespace-nowrap rounded-md border">
        <div className="flex gap-4 p-4">
          {products?.map((item: ProductCardProps) => (
            <Link
              href={`/result/${item._id?.toString() ? item._id.toString() : ""}`}
              key={item._id?.toString() ? item._id.toString() : item.name}
            >
              <ProductCard
                average_rating={item.average_rating}
                images={item.images}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                discount={item.discount}
              />
            </Link>
          ))}

          <ScrollBar className="hidden md:flex" orientation="horizontal" />
        </div>
      </ScrollArea>
    </>
  );
};

export default ProductScrollArea;
