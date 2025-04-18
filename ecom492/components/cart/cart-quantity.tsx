"use client";
import { SquareMinus, SquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CartQuantityProps {
  quantity: number;
}

const CartQuantity = ({quantity}: CartQuantityProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);

  }

  return (
    <>
      <Button variant="default" className="">
        <SquarePlus />
      </Button>
      <Input
        size={10}
        type="number"
        className="text-center"
        onChange={(e) => handleChange(e)}
        value={quantity || 1}
      />
      <Button variant="destructive" className="">
        <SquareMinus />
      </Button>
    </>
  );
};

export default CartQuantity;
