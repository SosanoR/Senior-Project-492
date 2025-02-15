import ProductCard from "./product-card";
import { ProductCardProps } from "@/_common/types";

interface ProductListProps {
  products: ProductCardProps[];
  title?: string;
}

const ProductList = ({ products, title }: ProductListProps) => {
  return (
    <div>
      <h2 className="h2-bold mb-4">{title}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slideinup">
          {products.map((product: ProductCardProps, key: React.Key) => (
            <ProductCard
              key={key}
              _id={product._id}
              item_image={product.item_image}
              item_name={product.item_name}
              item_price={product.item_price}
              item_quantity={product.item_quantity}
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
