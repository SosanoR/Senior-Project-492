"use client";

import { useState } from "react";
import { Button } from "../ui/button";
// import { Command, CommandInput, CommandList, CommandItem } from "../ui/command";
import { getAutocompleteSuggestions } from "@/lib/actions/product.actions";
import { suggestionsProps } from "@/_common/types";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [suggestions, setSuggestions] = useState<suggestionsProps[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>();

  const router = useRouter();

  const getSuggestions = async (query: string) => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        console.log(`query`, query);
        const res = await getAutocompleteSuggestions(query);
        console.log(`res`, res);
        if (res) {
          console.log("?");
          setSuggestions(res);
        }
      }, 300)
    );
  };

  const changeInputValue = (id: string) => {
    setSuggestions([]);
    router.push(`/result/${id}`);
  };

  return (
    <>
      <form className="w-full flex items-center justify-center space-x-2 grow">
        <div className="flex justify-center">
          <div className="relative grid">
            <div className="flex w-full items-center">
              <Input type="search" placeholder="Search here" onChange={(text) => getSuggestions(text.target.value)} />
              {suggestions && (
                <ul className="absolute top-[2.5rem] bg-black text-white dark:bg-white dark:text-black w-full rounded">
                  {suggestions.map((item: suggestionsProps, index) => (
                    <li key={index} onClick={() => changeInputValue(item._id.toString())} className="hover:cursor-pointer hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white p-2">
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Button className="max-w-xs">Search</Button>
        </div>
      </form>
    </>
  );
};

export default SearchBar;
