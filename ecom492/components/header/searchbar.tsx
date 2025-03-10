"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Command, CommandInput, CommandList, CommandItem } from "../ui/command";
import { getAutocompleteSuggestions } from "@/lib/actions/product.actions";
import { suggestionsProps } from "@/_common/types";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [suggestions, setSuggestions] = useState<suggestionsProps[]>();
  const [displaySuggestions, setDisplaySuggestions] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>();
  const [searchField, setSearchField] = useState<string>();
  const router = useRouter();

  const getSuggestions = async (query: string) => {
    setSearchField(query);
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        const res = await getAutocompleteSuggestions(query);
        if (res) {
          const data: suggestionsProps[] = JSON.parse(res);
          if (data.length > 0) {
            setSuggestions(data);
            setDisplaySuggestions(false);
          } else {
            setSuggestions([]);
          }
        }
      }, 300)
    );
  };

  const changeInputValue = (text: string, id: string) => {
    setSearchField(text);
    setDisplaySuggestions(true);
    router.push(`/result/${id}`);
  };

  return (
    <>
      <form>
        <div className="flex">
          <div className="relative">
            <Command className="">
              <CommandInput
                placeholder="Search Here"
                onValueChange={(text) => getSuggestions(text)}
                value={searchField}
              />
              <div className="">
                <CommandList
                  className="absolute bg-black text-white dark:bg-white dark:text-black w-full rounded"
                  hidden={displaySuggestions}
                >
                  {suggestions &&
                    suggestions.map((item) => (
                      <CommandItem
                        key={item.name}
                        onSelect={(text) => changeInputValue(text, item._id.toString())}
                        className="hover:cursor-pointer"
                      >
                        {item.name}
                      </CommandItem>
                    ))}
                </CommandList>
              </div>
            </Command>
          </div>
          <Button>Search</Button>
        </div>
      </form>
    </>
  );
};

export default SearchBar;
