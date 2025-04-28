"use server";
import { ObjectId } from "mongodb";
import client from "../db";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { convertToPlainObject } from "../utils";
import { cart, data } from "@/_common/types";
import { cartItemSchema, cartSchema } from "../validators";
import { calcPrice } from "../utils";
import { revalidatePath } from "next/cache";

export async function addToCart(
  data: {
    product_id: string;
    name: string;
    brand: string;
    price: number;
    discount: number;
    quantity: number;
    image: string;
    average_rating?: number;
  },
  quantity = 1
) {
  try {
    const session = await auth();
    const user_id = session?.user?.id ? session.user.id.toString() : undefined;

    const cart_id = (await cookies()).get("cart_id")?.value;
    if (!cart_id) {
      throw new Error("Cart ID not found in cookies.");
    }

    const cart = await findCart();
    const item = cartItemSchema.parse(data);

    const product = await client
      .db("testDB")
      .collection<data>("items")
      .findOne({
        _id: new ObjectId(item.product_id),
      });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!cart) {
      const newCart = cartSchema.parse({
        user_id: user_id,
        items: [item],
        cart_id: cart_id,
        ...calcPrice([item]),
        status: "active",
        created_on: new Date(),
        last_modified: new Date(),
      });

      await client.db("testDB").collection("Cart").insertOne(newCart);
      revalidatePath(`/result/${item.product_id}`);
    } else {
      const item_exists_in_cart = cart.items.find(
        (prod) => prod.product_id === data.product_id
      );

      if (item_exists_in_cart) {
        if (product.quantity < item_exists_in_cart.quantity + quantity) {
          throw new Error("Not enough product in stock.");
        }

        cart.items.find(
          (prod) => prod.product_id === item.product_id
        )!.quantity = item_exists_in_cart.quantity + quantity;
      } else {
        if (product.quantity < 1) {
          throw new Error("Not enough product in stock.");
        }

        cart.items.push(item);
      }

      await client
        .db("testDB")
        .collection("Cart")
        .updateOne(
          { _id: new ObjectId(cart._id) },
          {
            $set: {
              items: cart.items,
              total_price: calcPrice(cart.items).total_price,
            },
          }
        );
      revalidatePath(`/result/${item.product_id}`);
    }

    return {
      success: true,
      message: `${item.name} was succesfully added to your cart.`,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add to cart.",}
  }
}

export async function removeFromCart(
  product_id: string,
  quantity = 1,
  remove_all = false
) {
  try {
    const cart_id = (await cookies()).get("cart_id")?.value;
    if (!cart_id) {
      throw new Error("Cart ID not found in cookies.");
    }

    const cart = await findCart();
    if (!cart) {
      throw new Error("Cart not found.");
    }

    const found_item = cart.items.find(
      (prod) => prod.product_id === product_id
    );
    if (!found_item) {
      throw new Error("Product not found in cart.");
    }

    if (found_item.quantity <= quantity || remove_all) {
      cart.items = cart.items.filter(
        (prod) => prod.product_id !== found_item.product_id
      );
    } else {
      cart.items.find(
        (prod) => prod.product_id === found_item.product_id
      )!.quantity = found_item.quantity - quantity;
    }

    await client
      .db("testDB")
      .collection<cart>("Cart")
      .updateOne(
        { _id: new ObjectId(cart._id) },
        {
          $set: {
            items: cart.items,
            total_price: calcPrice(cart.items).total_price,
          },
        }
      );
    revalidatePath(`/result/${found_item.product_id}`);

    return {
      success: true,
      message: `${found_item.name} was removed.`,
    };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to remove from cart.",
    }
  }
}

export async function editCartItemQuantity(
  product_id: string,
  quantity: number,
  user_cart: cart
) {
  try {
    const cart = await findCart();
    if (!cart) {
      throw new Error("Cart not found.");
    }


    const cart_id = (await cookies()).get("cart_id")?.value;
    if (!cart_id) {
      throw new Error("Cart ID not found in cookies.");
    }

    if ((cart_id !== user_cart.cart_id) && (cart.user_id !== user_cart.user_id)) {
      throw new Error("Cart ID does not match the user's cart.");
    }


    const found_item = cart.items.find(
      (prod) => prod.product_id === product_id
    );

    if (!found_item) {
      throw new Error("Product not found in cart.");
    }

    if (quantity < 0) {
      throw new Error("Quantity must be greater than or equal to 0.");
    }

    found_item.quantity = quantity;

    const product = await client
      .db("testDB")
      .collection<data>("items")
      .findOne({
        _id: new ObjectId(found_item.product_id),
      });

    if (!product) {
      throw new Error("Product not found.");
    }

    if ((product.quantity < quantity) || (product.quantity < found_item.quantity)) {
      throw new Error("Not enough product in stock.");
    }

    if (found_item.quantity === 0) {
      cart.items = cart.items.filter(
        (prod) => prod.product_id !== found_item.product_id
      );
    }

    await client
      .db("testDB")
      .collection<cart>("Cart")
      .updateOne(
        { _id: new ObjectId(cart._id) },
        {
          $set: {
            items: cart.items,
            total_price: calcPrice(cart.items).total_price,
          },
        }
      );
    revalidatePath(`/cart`);

    return {
      success: true,
      message: `${found_item.name} quantity updated to ${quantity}.`,
    };
  } catch (error) {
    console.error("Error editing cart item quantity:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to edit cart item quantity.",
    };
  }
}

export async function findCart() {
  try {
    const session = await auth();
    const user_id = session?.user?.id ? session.user.id.toString() : undefined;
    const cart_id = (await cookies()).get("cart_id")?.value;
    let cart: cart | null;

    if (!cart_id) {
      throw new Error("Cart ID not found in cookies.");
    }

    if (user_id) {
      cart = await client
        .db("testDB")
        .collection<cart>("Cart")
        .findOne<cart>({ user_id: user_id, status: "active" });
    } else {
      cart = await client
        .db("testDB")
        .collection<cart>("Cart")
        .findOne<cart>({ cart_id: cart_id });
    }

    if (!cart) {
      return undefined;
    }

    return convertToPlainObject({
      ...cart,
      items: cart.items,
    });
  } catch (error) {
    console.error("Error finding cart:", error);
    throw new Error("Failed to find cart.");
  }
}
