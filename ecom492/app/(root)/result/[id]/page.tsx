import { findProduct } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

const ProductDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const product = await findProduct(id);

  if (!product) {
    notFound();
  }

  return <>{product?.item_name}</>;
};

export default ProductDetailsPage;
