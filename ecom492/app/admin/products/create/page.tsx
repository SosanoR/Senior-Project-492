import { auth } from "@/auth";
import ProductForm from "@/components/admin/create-products/product-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  const session = await auth();
  const id = session?.user?.id;

  if (!session || !id) {
    return redirect("/login");
  }

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="create" id={id} />
      </div>
    </>
  );
};

export default CreateProductPage;
