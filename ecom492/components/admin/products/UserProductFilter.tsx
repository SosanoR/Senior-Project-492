"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ProductFilter = () => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>();
  const router = useRouter();

  const handleProductQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    const params = new URLSearchParams(window.location.search);
    
    params.set("query", query);
    params.set("page", "1");

    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        router.push(`/admin/products?${params}`);
      }, 500) 
    );
  };
  return (
    <div>
      <Input
        placeholder="Search your products here"
        onChange={(e) => handleProductQuery(e)}
      />
    </div>
  );
};

export default ProductFilter;
