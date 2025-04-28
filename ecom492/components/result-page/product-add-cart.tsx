"use client";
import { Button } from "../ui/button";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { toast } from "react-toastify";
import { cart, cartItem } from "@/_common/types";
import { useState } from "react";

const CartAddButton = ({
  product,
  cart,
}: {
  product: cartItem;
  cart?: cart;
}) => {
  const [submitting, setSubmitting] = useState(false);


  const handleAddToCart = async () => {
    setSubmitting(true);
    const data = {
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      discount: product.discount,
      quantity: 1,
      image: product.image,
      average_rating: product.average_rating,
    };
    const res = await addToCart(data);
    setSubmitting(false);
    if (res.success) {
      toast.success("Item added to cart successfully.");
    } else {
      toast.error("Failed to add item to cart.");
    }
  };

  const handleRemoveFromCart = async () => {
    setSubmitting(true);
    const res = await removeFromCart(product.product_id, 1, true);
    if (res.success) {
      toast.success("Item removed from cart successfully.");
    } else {
      toast.error("Failed to remove item from cart.");
    }
    setSubmitting(false);
  };

  const itemInCart =
    cart && cart.items.find((item) => item.product_id === product.product_id);

  return (
    <>
      {itemInCart ? (
        <Button
          id="remove_btn"
          disabled={submitting}
          variant="destructive"
          onClick={handleRemoveFromCart}
          className="w-full"
        >
          {submitting ? "Removing..." : "Remove from Cart"}
        </Button>
      ) : (
        <Button
          id="add_btn"
          disabled={submitting}
          variant="default"
          onClick={handleAddToCart}
          className="w-full hover:bg-green-300"
        >
          {submitting ? "Adding..." : "Add to Cart"}
        </Button>
      )}
    </>
  );
};

export default CartAddButton;
