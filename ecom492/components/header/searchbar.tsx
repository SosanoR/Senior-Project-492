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

        const res = await getAutocompleteSuggestions(query);

        if (res) {
          setSuggestions(res);
        }
      }, 300)
    );
  };

  const changeInputValue = (name: string) => {
    const inputfield = document.getElementById("website-searchbar") as HTMLInputElement;
    inputfield.value = name;
    setSuggestions([]);
    router.push(`/results?query=${name}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input[type='search']") as HTMLInputElement;
    const query = input.value.trim();
    setSuggestions([]);
    if (query || query.length > 0) {
      router.push(`/results?${new URLSearchParams({ query }).toString()}`);
    }
  };

  return (
    <>
      <form className="flex  justify-center space-x-2 grow w-full " onSubmit={handleSubmit}>
        <div className="flex w-full justify-center">
          <div className="relative grid w-full">
            <div className="flex w-full items-center" >
              <Input id="website-searchbar" type="search" className="w-full flex grow" placeholder="Search here" onChange={(text) => getSuggestions(text.target.value) }  />
              {suggestions && (
                <ul className="absolute z-10 top-[2.5rem] bg-black text-white dark:bg-white dark:text-black w-full rounded">
                  {suggestions.map((item: suggestionsProps, index) => (
                    <li key={index} onClick={() => changeInputValue(item.name)} className="hover:cursor-pointer  hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white p-2">
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Button className="max-w-xs hover:bg-green-600">Search</Button>
        </div>
      </form>
    </>
  );
};

export default SearchBar;
