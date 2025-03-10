import { ProductCardProps } from "@/_common/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ProductImage from "./product-image";
import Link from "next/link";
interface ProductBlockProps {
  title?: string;
  products: ProductCardProps[];
}

const ProductBlock = ({ title, products }: ProductBlockProps) => {
  const width = 150;
  const height = 150;
  return (
    <div>
      <div className="flex justify-start">
        <h2 className="h2-bold mb-4">{title}</h2>
      </div>
      <div className="flex justify-center items-center">
        <Card className="w-full md:w-[37rem]  place-content-evenly">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8 ">
            {products.map((product, key) => (
              <Link href={`/result/${product._id}`} key={key}>
                <Card className="w-full md:h-[15rem] content-center ">
                  <CardContent className="flex justify-center items-center">
                    <ProductImage
                      images={product.images}
                      name={product.name}
                      width={width}
                      height={height}
                    />
                  </CardContent>
                  <CardTitle className="flex justify-center text-lg">
                    {product.name}
                  </CardTitle>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductBlock;
