"use client";
import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <CldImage
        src={images[current]}
        alt="Product Images"
        width={1000}
        height={1000}
        className="min-h-[300px]"
        quality="auto"
        format="auto"
        crop="pad"
        gravity="center"
        removeBackground
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500"
            )}
          >
            <CldImage
              src={image}
              alt="image"
              width={100}
              height={100}
              quality="auto"
              format="auto"
              crop="pad"
              gravity="center"
              removeBackground
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
