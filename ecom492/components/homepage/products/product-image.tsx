"use client";
import { CldImage } from "next-cloudinary";

interface ProductImageProps {
  item_image: string[];
  item_name: string;
  width: number;
  height: number;
}

const ProductImage = ({ item_image, item_name, width, height }: ProductImageProps) => {
  return (
    <CldImage
      src={item_image[0]}
      alt={item_name}
      width={width}
      height={height}
      priority
      crop="pad"  
      gravity="center"
      removeBackground
      
    />
  );
};

export default ProductImage;
