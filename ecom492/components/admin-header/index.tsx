import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "@/components/header/menu";
import SearchBar from "@/components/header/searchbar";

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
          <span className="flex text-xl ml-3 gap-2">
            <Link href={`/`}>Overview</Link>
            <Link href={`/admin/products`}>Products</Link>
            <Link href={`/admin/orders`}>Orders</Link>
            <Link href={`/admin/user`}>User</Link>
          </span>
        </div>
        <SearchBar />
        <Menu />
      </div>
    </header>
  );
};

export default Header;
