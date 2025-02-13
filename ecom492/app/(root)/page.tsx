import { getLatest } from "@/lib/actions/product.actions";
import ProductList from "@/components/homepage/products/product-list";
import { PRODUCT_DISPLAY_LIMIT } from "@/lib/constants";
export default async function Home() {

  const res = await getLatest(PRODUCT_DISPLAY_LIMIT);
  return <>
    <ProductList products={res ? res : []} title="Best Selling" />
  </>;
}
