import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({className}: LogoProps) => {
  return (
    <Link href={"/"} className="text-4xl">
      <Button variant="link" className={cn("text-4xl font-bold hover:bg-green-600", className)}>
        Mercury Express
      </Button>
    </Link>
  );
};

export default Logo;
