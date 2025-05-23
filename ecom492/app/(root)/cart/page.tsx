import EmptyCart from "@/components/cart/cart-empty-btn";
import CartQuantity from "@/components/cart/cart-quantity";
import ResultCard from "@/components/results-page/result-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findCart } from "@/lib/actions/cart.actions";
import Link from "next/link";

const CartPage = async () => {
  const cart = await findCart();

  return (
    <div>
      
      {(!cart || cart.items.length === 0) && (
        <div className="flex flex-col items-center h-full w-full">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-lg">Start shopping now!</p>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <div className="flex justify-center h-full w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Your cart</h1>
            <div className="flex-col w-full p-4 items-center content-center gap-4">
              <div className="">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Cart Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-lg">
                        Total Products: {cart.items.length}
                      </p>
                      <p className="text-lg">
                        Total Items:{" "}
                        {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                      </p>
                      <p className="text-lg">
                        Total Price: ${cart.total_price}
                      </p>
                      <div className="flex-col m-2 space-y-2">
                        <div className="">
                          <Button
                            variant="default"
                            type="button"
                            className="px-[4.35rem] lg:px-[6.35rem] hover:bg-green-600"
                          >
                            Checkout
                          </Button>
                        </div>
                        <div>
                          <EmptyCart />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="flex-col lg:col-span-5 w-full p-4">
                <CardTitle className="text-2xl font-bold text-center">
                  Cart Items
                </CardTitle>
                <CardContent>
                  <div className="grid md:grid-cols-2  gap-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex-col md:grid items-center justify-between p-4 border-b gap-5"
                      >
                        <Link href={`/result/${item.product_id}`}>
                          <ResultCard
                            name={item.name}
                            images={[item.image]}
                            brand={item.brand}
                            price={item.price}
                            discount={item.discount}
                            average_rating={item.average_rating}
                            height={200}
                            width={200}
                            hidden={true}
                          />
                        </Link>
                        <div className="flex items-center justify-center">
                          <CartQuantity
                            quantity={item.quantity}
                            user_cart={cart}
                            product_id={item.product_id}
                          />
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
