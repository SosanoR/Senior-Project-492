"use client";
import { SquareMinus, SquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { cart } from "@/_common/types";
import { editCartItemQuantity } from "@/lib/actions/cart.actions";

interface CartQuantityProps {
  quantity: number;
  product_id: string;
  user_cart?: cart;
}

const CartQuantity = ({
  quantity,
  product_id,
  user_cart,
}: CartQuantityProps) => {
  const [val, setVal] = useState<number>(quantity || 1);
  const [updating, setUpdating] = useTransition();

  return (
    <>
      <Button
        variant="default"
        className=""
        onClick={() =>
          setUpdating(async () => {
            if (user_cart) {
              await editCartItemQuantity(product_id, val + 1, user_cart);
            }
            setVal((prev) => prev + 1);
          })
        }
        disabled={updating}
      >
        <SquarePlus />
      </Button>
      <Input
        size={10}
        type="number"
        className="text-center"
        readOnly={true}
        value={val}
        min={0}
      />
      <Button
        variant="destructive"
        className=""
        onClick={() => {
          setUpdating(async () => {
            if (user_cart) {
              await editCartItemQuantity(product_id, val - 1, user_cart);
            }
            setVal((prev) => prev - 1);
          });
        }}
        disabled={updating}
      >
        <SquareMinus />
      </Button>
    </>
  );
};

export default CartQuantity;
