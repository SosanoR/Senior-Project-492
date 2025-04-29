"use client";
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
  price: string | number;
  discount?: number;
  average_rating: number;
  height: number;
  width: number;
  hidden?: boolean;
}
const ResultCard = ({
  name,
  images,
  brand,
  price,
  discount = 0,
  average_rating,
  height,
  width,
  hidden = false,
}: ResultCardProps) => {
  return (
    <Card className="flex w-full flex-cols-2 p-1 m-1">
      <CardContent className={`${hidden ?  "hidden sm:flex" : "flex"} justify-start self-center p-3`}>
        <ProductImage
          width={width}
          height={height}
          images={images}
          name={name}
        />
      </CardContent>
      <CardHeader className="w-full justify-center items-center">
        <div className="flex justify-center p-2 m-1 space-y-2">
          <CardTitle className="text-lg text-center">{name}</CardTitle>
        </div>
        <CardDescription className="text-md text-black dark:text-white text-center justify-center ">
          <div>Brand: {brand}</div>
          <div className={discount >  0 ? "text-green-400" : ""}>${(Number(price) * ((100 - discount) / 100)).toFixed(2)}</div>
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
};

export default ResultCard;
