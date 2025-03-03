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
      sizes="(min-width: 320px) 100vw, (min-width: 640px) 50vw, (min-width: 768px) 33.3vw, 25vw"
    />
  );
};

export default ProductImage;
