import { getLatest } from "@/lib/actions/product.actions";
import ProductList from "@/components/homepage/products/product-list";
export default async function Home() {
  const productResultsLimit = 4;
  const res = await getLatest(productResultsLimit);
  return <>
    <ProductList products={res ? res : []} title="Best Selling" limit={productResultsLimit} />
  </>;
}
