"use client";
import { CldImage } from "next-cloudinary";

interface ProductImageProps {
  item_image: string;
  item_name: string;
}

const ProductImage = ({ item_image, item_name }: ProductImageProps) => {
  return (
    <CldImage
      src={item_image[0]}
      alt={item_name}
      width={300}
      height={300}
      priority
      crop="pad"  
      gravity="center"
      removeBackground
      
    />
  );
};

export default ProductImage;
