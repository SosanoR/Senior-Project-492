import { Card, CardContent } from "@/components/ui/card";
import ProductImage from "./product-image";
import Link from "next/link";

interface BlockCardProps {
  id: string;
  image: string[];
  name: string;
}

const BlockCard = ({ id, image, name }: BlockCardProps) => {
  return (
    <>
      <Card>
        <CardContent>
          <Link href={`result/${id}`}>
            <ProductImage name={name} image={image} width={280} height={280} />
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default BlockCard;
