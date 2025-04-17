"use client";

import { reviewFormSchemaInsert, reviewFormSchemaUpdate } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { reviewDefaultValues } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createOrModifyReview } from "@/lib/actions/review.actions";
import { Slide, toast } from "react-toastify";
import { userReviews } from "@/_common/types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  user_id: string;
  product_id: string;
  user_name: string;
  user_review?: userReviews;
}

const ReviewForm = ({
  user_id,
  product_id,
  user_name,
  user_review,
}: ReviewFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof reviewFormSchemaInsert>>({
    resolver: zodResolver(user_review ? reviewFormSchemaUpdate : reviewFormSchemaInsert),
    defaultValues: user_review ? user_review : reviewDefaultValues,
  });

  useEffect(() => {
    form.reset(user_review ? user_review : reviewDefaultValues);
  }, [user_review, form]);  

  const onSubmit = async (data: z.infer<typeof reviewFormSchemaInsert>) => {
    const res = await createOrModifyReview(data);
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
  };

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex">
            <FormField
              control={form.control}
              name="rating"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof reviewFormSchemaInsert>,
                  "rating"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Star Rating</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select a rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end w-full">
              <Button
                type="submit"
                className="w-40 hover:bg-green-400"
                disabled={form.formState.isSubmitting}
                onClick={() => (
                  form.setValue("product_id", product_id),
                  form.setValue("user_id", user_id),
                  form.setValue("user_name", user_name)
                )}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="text"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof reviewFormSchemaInsert>,
                "text"
              >;
            }) => (
              <FormItem>
                <FormLabel>Written Review</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full h-20 border border-gray-300 rounded-md p-2 resize-none"
                    placeholder="Write your Review here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default ReviewForm;
