import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "@/components/header/menu";
import SearchBar from "@/components/header/searchbar";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
              className="dark:bg-white rounded-xl"
            />
          </Link>

          <div className="md:hidden mx-3">
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Products"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="Orders">Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="hidden md:flex text-xl ml-3 gap-2">
            <Link href={`/admin/products`}>Overview</Link>
            <Link href={`/admin/products`}>Products</Link>
            <Link href={`/admin/products`}>Orders</Link>
          </span>
        </div>
        <SearchBar />
        <Menu />
      </div>
    </header>
  );
};

export default Header;
