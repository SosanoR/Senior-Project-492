import ProductImage from "@/components/homepage/products/product-image";
import DisplayStars from "@/components/shared/display-stars";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

interface ResultCardProps {
    name: string;
    images: string[];
    brand: string;
    price: string;
    average_rating: number;
}
const ResultCard = ({name, images, brand, price, average_rating}: ResultCardProps) => {
    return (  
        <Card className="flex w-full flex-cols-2">
            <CardContent className="flex justify-start self-center p-3">
              <ProductImage
                width={250}
                height={250}
                images={images}
                name={name}
              />
            </CardContent>
            <CardHeader className="w-full">
              <div className="flex justify-center">
                <CardTitle className="text-xl">{name}</CardTitle>
              </div>
              <CardDescription className="text-md text-black dark:text-white">
                <div>Brand: {brand}</div>
                <div>${price}</div>
                <div className="flex space-x-2">
                  <div className="flex">
                    <DisplayStars rating={average_rating} />
                  </div>
                  <div>{average_rating}</div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
    );
}
 
export default ResultCard;