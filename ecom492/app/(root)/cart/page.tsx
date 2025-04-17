import CartQuantity from "@/components/cart/cart-quantity";
import ResultCard from "@/components/results-page/result-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { findCart } from "@/lib/actions/cart.actions";

const CartPage = async () => {
  const cart = await findCart();
  console.log(cart);
  console.log("cart items", cart?.items);

  return (
    <div>
      {(!cart || cart.items.length === 0) && (
        <div className="flex flex-col items-center h-screen">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-lg">Start shopping now!</p>
        </div>
      )}
      {cart && cart.items.length > 0 && (
        <div className="flex items-start h-screen">
          <div>
            <h1 className="text-2xl font-bold">Your cart</h1>
            <div className="flex w-full max-w-4xl p-4">
              <Card>
                <CardTitle className="text-2xl font-bold text-center">
                  Cart Items
                </CardTitle>
                <CardDescription className="text-lg text-center">
                  You have {cart.items.length} items in your cart.
                </CardDescription>
                <CardContent>
                  <div className="grid md:grid-cols-2  gap-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex-col md:grid items-center justify-between p-4 border-b gap-5"
                      >
                        <ResultCard
                          name={item.name}
                          images={[item.image]}
                          brand={item.brand}
                          price={item.price}
                          average_rating={item.average_rating}
                          height={200}
                          width={200}
                          hidden={true}
                        />
                        <div className="flex items-center justify-center">
                          <CartQuantity />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CartPage;
