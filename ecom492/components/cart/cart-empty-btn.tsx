"use client";
import { Button } from "../ui/button";
import { emptyCart } from "@/lib/actions/cart.actions";

const EmptyCart = () => {
  return (
    <Button
      variant="destructive"
      type="button"
      className="px-16 lg:px-24 hover:bg-red-600"
      onClick={emptyCart}
    >
      Empty Cart
    </Button>
  );
};

export default EmptyCart;
