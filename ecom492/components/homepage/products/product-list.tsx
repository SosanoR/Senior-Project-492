import ProductCard from "./product-card";

interface ProductListProps {
  products: any;
  title?: string;
  limit?: number;
}

const ProductList = ({ products, title, limit }: ProductListProps) => {
  const limitedProducts = limit ? products.slice(0, limit) : products;
  return (
    <div>
      <h2 className="h2-bold mb-4">{title}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedProducts.map((product: any, key: React.Key) => (
            <ProductCard key={key} product={product} />
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
