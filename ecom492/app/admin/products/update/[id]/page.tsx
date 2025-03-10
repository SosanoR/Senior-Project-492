import ProductForm from "@/components/admin/create-products/product-form";
import { findProduct } from "@/lib/actions/product.actions";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { convertToPlainObject } from "@/lib/utils";

const AdminProductUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const { id } = await props.params;
  const product = convertToPlainObject(await findProduct(id));
  const user_id = session?.user?.id;

  if (!product) {
    return notFound();
  }

  if (!session || !user_id) {
    return redirect("/");
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <ProductForm
        type="update"
        product={product}
        id={user_id}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
