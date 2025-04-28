import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "./product-card";
import { findProduct } from "@/lib/actions/product.actions";
import { data } from "@/_common/types";

interface ProductScrollAreaProps {
  title: string;
  products?: data[];
}

const ProductScrollArea = async ({
  title,
  product,
}: ProductScrollAreaProps) => {
  const res = await findProduct("67c77666439408c4156a268a");
  if (!res) {
    return <div>No product found</div>;
  }

  return (
    <>
      <h2 className="h2-bold mb-4">{title}</h2>
      <ScrollArea className="w-full  whitespace-nowrap rounded-md border">
        <div className="flex gap-4 p-4">
        
            <ProductCard
              _id={res?._id.toString()}
              average_rating={res?.average_rating}
              images={res?.images}
              name={res?.name}
              price={res?.price}
              quantity={res?.quantity}
              discount={res?.discount}
            />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ProductCard
            _id={res?._id.toString()}
            average_rating={res?.average_rating}
            images={res?.images}
            name={res?.name}
            price={res?.price}
            quantity={res?.quantity}
            discount={res?.discount}
          />
          <ScrollBar className="hidden md:flex" orientation="horizontal" />
        </div>
      </ScrollArea>
    </>
  );
};

export default ProductScrollArea;
