"use client";
import { CldImage } from "next-cloudinary";

interface ProductImageProps {
  images: string[];
  name: string;
  width: number;
  height: number;
}

const ProductImage = ({ images, name, width, height }: ProductImageProps) => {
  return (
    <CldImage
      src={images[0]}
      alt={name}
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
