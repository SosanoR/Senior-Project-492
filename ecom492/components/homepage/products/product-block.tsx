import { Card, CardContent } from "@/components/ui/card";
interface ProductBlockProps {
  title?: string;
}

const ProductBlock = ({ title }: ProductBlockProps) => {
  return (
    <div>
      <h2 className="h2-bold mb-4">{title}</h2>
      <Card className="w-[37rem]">
        <CardContent>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProductBlock;
