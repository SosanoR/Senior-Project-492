"use client";
import { SquareMinus, SquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const CartQuantity = () => {
  return (
    <>
      <Button variant="default" className="">
        <SquarePlus />
      </Button>
      <Input
        size={10}
        type="number"
        className="text-center"
        onSubmit={handleSubmit}
      />
      <Button variant="destructive" className="">
        <SquareMinus />
      </Button>
    </>
  );
};

export default CartQuantity;
