import Link from "next/link";
import Menu from "@/components/header/menu";
import SearchBar from "@/components/header/searchbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import Logo from "@/components/shared/logo";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="flex-between">
      <div className="wrapper lg:flex p-2 ">
        <div className="flex justify-center m-2">
          <Logo className="text-4xl" />
        </div>
        <div className="flex justify-end items-center w-full">
          <SearchBar />
          <Menu />
        </div>
      </div>
      </div>
          <div className="self-start md:flex md:justify-center">
            <div className="md:hidden mx-3">
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Products</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span className="hidden md:flex text-xl m-3">
              <Link href={`/admin/products`}>Products</Link>
            </span>
          </div>
    </header>
  );
};

export default Header;
