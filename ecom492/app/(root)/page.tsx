import { getLatest } from "@/lib/actions/product.actions";
import ProductList from "@/components/homepage/products/product-list";
// import ProductBlock from "@/components/homepage/products/product-block";
import { PRODUCT_DISPLAY_LIMIT } from "@/lib/constants";
// import { auth } from "@/auth";




export default async function Home() {
  const res = await getLatest(PRODUCT_DISPLAY_LIMIT);
  // const session = await auth();
  return (
    <>
      <div className="space-y-5">
        <ProductList products={res ? res : []} title="Best Selling" />
        {/* <ProductBlock title="Continue where you left off" /> */}
      </div>
    </>
  );
}
