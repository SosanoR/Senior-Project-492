"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MinMaxFilter = () => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value;
    const params = new URLSearchParams(window.location.search);
    params.set("min", newMin);
    params.set("currentPage", "1");
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        router.push(`/results?${params}`);
      }, 500) 
    );
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value;
    const params = new URLSearchParams(window.location.search);
    params.set("max", newMax);
    params.set("currentPage", "1");
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        router.push(`/results?${params}`);
      }, 500) 
    );
  }

  return (
    <div className="pl-4">
      <div>
        <Label htmlFor="min-price">Min Price</Label>
        <Input id="min-price" type="number" placeholder="0" min={0} max={10000} className="w-20 text-green-500"  onChange={handleMinChange}/>
      </div>

      <div>
        <Label htmlFor="max-price">Max Price</Label>
        <Input id="max-price" type="number" placeholder="1000" min={0} max={10000} className="w-20 text-green-500" onChange={handleMaxChange}/>
      </div>
    </div>
  );
};

export default MinMaxFilter;
