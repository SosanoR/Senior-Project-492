import Menu from "./menu";
import SearchBar from "./searchbar";
import Logo from "../shared/logo";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper lg:flex p-2 ">
        <div className="flex justify-center m-2">
          <Logo className="text-4xl " />
        </div>
        <div className="flex justify-end items-center w-full">
          <SearchBar />
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
