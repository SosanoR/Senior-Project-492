import ProductCard from "./product-card";
import { ProductCardProps } from "@/_common/types";

interface ProductListProps {
  products: ProductCardProps[];
  title?: string;
}

const ProductList = ({ products, title }: ProductListProps) => {
  return (
    <div>
      <div className="flex justify-start">
        <h2 className="h2-bold mb-4">{title}</h2>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center">
          {products.map((product: ProductCardProps, key: React.Key) => (
            <ProductCard
              key={key}
              _id={product._id}
              images={product.images}
              name={product.name}
              price={product.price}
              discount={product.discount}
              quantity={product.quantity}
              average_rating={product.average_rating}
            />
          ))}
        </div>
      ) : (
        <div>
          <p>No Products Found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
