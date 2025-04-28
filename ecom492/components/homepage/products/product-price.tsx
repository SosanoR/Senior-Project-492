import { cn } from "@/lib/utils";

interface ProductPriceProps {
  value: number;
  discount?: number;
  className?: string;
}

const ProductPrice = ({ value, discount = 0, className }: ProductPriceProps) => {
  const stringValue = value.toFixed(2);
  const [intVal, floatVal] = stringValue.split(".");

  const discountValue = value - value * (discount / 100);
  const stringDiscountValue = discountValue.toFixed(2);
  const [intDiscountVal, floatDiscountVal] = stringDiscountValue.split(".");

  return (
    <div className="">
      <div className="">
        {discount || discount > 0 ? (
          <div className="relative bottom-4 gap-1 ">
            <p className="text-lg text-destructive line-through">
              <span className="text-xs align-super">$</span>
              {intVal}
              <span className="text-xs align-super">{floatVal}</span>
            </p>
            <p className={cn("text-2xl ", className)}>
              <span className="text-xs text-green-500 align-super">$</span>
              <span className="text-green-500">{intDiscountVal}</span>
              <span className="text-xs align-super text-green-500">
                {floatDiscountVal}
              </span>
            </p>
          </div>
        ) : (
          <p className={cn("text-2xl", className)}>
            <span className="text-xs align-super">$</span>
            {intVal}
            <span className="text-xs align-super">{floatVal}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductPrice;
