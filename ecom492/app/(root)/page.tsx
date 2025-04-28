import {
  getBestSelling,
  getBestSellingElectronics,
  getLastViewedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import ProductList from "@/components/homepage/products/product-list";
import ProductBlock from "@/components/homepage/products/product-block";
import { PRODUCT_DISPLAY_LIMIT } from "@/lib/constants";
import { auth } from "@/auth";
import { ProductCardProps } from "@/_common/types";
import ProductScrollArea from "@/components/homepage/products/product-scroll-area";


export default async function Home() {
  const session = await auth();
  const bestSellingRes = await getBestSelling(PRODUCT_DISPLAY_LIMIT);
  const latestArrivalsRes = await getLatestProducts(PRODUCT_DISPLAY_LIMIT);
  const bestSellingElectronicsRes = await getBestSellingElectronics(
    PRODUCT_DISPLAY_LIMIT
  );
  let lastViewedProducts: ProductCardProps[] | undefined = [];

  if (session) {
    if (session.user?.id) {
      lastViewedProducts = await getLastViewedProducts(
        PRODUCT_DISPLAY_LIMIT,
        session.user.id
      );
    }
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="space-y-5">

          <ProductList
            products={bestSellingRes ? bestSellingRes : []}
            title="Best Selling"
          />


        <div className="grid gap-4 xl:grid-cols-2">
          <ProductBlock
            title="Latest Arrivals"
            products={latestArrivalsRes ? latestArrivalsRes : []}
          />

          {session && (
            <ProductBlock
              title="Continue Where You Left Off"
              products={lastViewedProducts ? lastViewedProducts : []}
            />
          )}

          {!session && (
            <ProductBlock
              title="Electronics"
              products={
                bestSellingElectronicsRes ? bestSellingElectronicsRes : []
              }
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <ProductScrollArea title="Top Discounts" />
      </div>
    </div>
  );
}
