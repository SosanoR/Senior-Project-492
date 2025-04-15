"use client";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface SortingOptionsProps {
  sortMethod: string;
}

const SortingOptions = ({sortMethod}: SortingOptionsProps) => {
  const router = useRouter();
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    console.log(`sorting by ${value}`);
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/results?${params}`);
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex justify-start text-2xl">
        <Label htmlFor="sort">Sort By</Label>
      </div>
      <Select onValueChange={handleSortChange} defaultValue={sortMethod}>
        <SelectTrigger id="sort" className="w-[180px]">
          <SelectValue placeholder={sortMethod} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
        
          <SelectItem value="price-l-h">Price: Low to High</SelectItem>

          <SelectItem value="price-h-l">Price: High to Low</SelectItem>

          <SelectItem value="rating-h-l">Rating: High to Low</SelectItem>

          <SelectItem value="rating-l-h">Rating: Low to High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingOptions;
