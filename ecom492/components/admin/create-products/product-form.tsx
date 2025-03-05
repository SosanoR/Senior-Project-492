"use client";

import { data } from "@/_common/types";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productDefaultVals } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatToTitleCase } from "@/lib/utils";
import {
  createProduct,
  updateProduct,
  removeImage,
  removeImages,
} from "@/lib/actions/product.actions";
import { Slide, toast } from "react-toastify";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface productFormProps {
  type: "create" | "update";
  product?: data;
  id: string;
}

const ProductForm = ({ type, product, id }: productFormProps) => {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "update" ? updateProductSchema : insertProductSchema
    ),
    defaultValues: product && type === "update" ? product : productDefaultVals,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    if (type === "create") {
      const res = await createProduct(values, id);

      if (!res.success) {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
      } else {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
        handleReset(false);
      }
    }

    if (type === "update") {
      if (!product?._id) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, _id: id });

      if (!res.success) {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
      } else {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
      }
    }
  };

  const handleImageRemoval = (image: string) => {
    const index = images.indexOf(image);
    const newImages = [...images];
    newImages.splice(index, 1);
    removeImage(image);
    form.setValue("images", newImages);

    setImages(newImages);
  };

  const handleSuccess = (e: CloudinaryUploadWidgetResults) => {
    const newImages = e.info as CloudinaryUploadWidgetInfo;

    form.setValue("images", [...form.getValues().images, newImages.public_id]);
    setImages(form.getValues().images);
  };

  const handleReset = (deleteImages: boolean) => {
    if (deleteImages) {
      removeImages(form.getValues().images);
    }
    form.reset();
    setImages([]);
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (onErrors) => {
          console.log(onErrors);
        })}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* price */}

          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "price"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "discount"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product discount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "brand"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "quantity"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product available quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* category */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "category"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {/*description*/}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "description"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    {images.length > 0 && (
                      <div className="flex gap-2">
                        {images.map((image, index) => (
                          <div key={index}>
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="default"
                                className="absolute rounded-full shadow hover:bg-red-500 hover:shadow-red-300"
                                size="sm"
                                onClick={() => handleImageRemoval(image)}
                              >
                                X
                              </Button>
                            </div>
                            <CldImage
                              src={image}
                              alt="Product Image"
                              width={125}
                              height={125}
                              crop="pad"
                              gravity="center"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <CldUploadWidget
                      options={{
                        sources: [
                          "local",
                          "camera",
                          "dropbox",
                          "google_drive",
                          "url",
                          "unsplash",
                        ],
                      }}
                      signatureEndpoint="/api/sign-cloudinary-params"
                      onSuccess={(e) => handleSuccess(e)}
                    >
                      {({ open }) => {
                        return (
                          <button
                            className="bg-black text-white dark:bg-white dark:text-black font-normal rounded-sm px-6 py-2"
                            type="button"
                            onClick={() => open()}
                          >
                            Upload Images
                          </button>
                        );
                      }}
                    </CldUploadWidget>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col justify-end gap-5 md:flex-row">
          {type === "create" && (
            <Button
              type="reset"
              size="lg"
              variant="destructive"
              className="hover:bg-red-600"
              onClick={() => handleReset(true)}
            >
              Reset
            </Button>
          )}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size="lg"
            className="hover:bg-green-400"
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : `${formatToTitleCase(type)} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
