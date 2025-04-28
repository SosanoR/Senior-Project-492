"use client";
import { SquareMinus, SquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { cart } from "@/_common/types";
import { editCartItemQuantity } from "@/lib/actions/cart.actions";
import { Slide, toast } from "react-toastify";

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
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant="default"
        className=""
        onClick={() =>
          startTransition(async () => {
            if (user_cart) {
              const res = await editCartItemQuantity(product_id, val + 1, user_cart);
              if (!res.success) {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 2500,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Slide,
                  });
                  return;
              }
            }
            setVal((prev) => prev + 1);
          })
        }
        disabled={isPending}
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
          startTransition(async () => {
            if (user_cart) {
              await editCartItemQuantity(product_id, val - 1, user_cart);
            }
            setVal((prev) => prev - 1);
          });
        }}
        disabled={isPending}
      >
        <SquareMinus />
      </Button>
    </>
  );
};

export default CartQuantity;
