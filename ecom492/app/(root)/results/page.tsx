import { PAGE_SIZE } from "@/lib/constants";
import { ProductResultsCardProps } from "@/_common/types";
import ResultCard from "@/components/results-page/result-card";
import {
  getAllSearchResults,
  getProductFilters,
} from "@/lib/actions/product.actions";
import { formatToTitleCase } from "@/lib/utils";
import Link from "next/link";
// import TestPage from "../test/page";

import MinMaxFilter from "@/components/results-page/min-max-filters";
import SortingOptions from "@/components/results-page/sorting-filter";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchParamsProps {
  query: string;
  category?: string;
  sort?: string;
  brand?: string;
  min?: string;
  max?: string;
  currentPage: string;
}

interface urlParams {
  categoryFilter?: string;
  sortingFilter?: string;
  brandFilter?: string;
  floor?: string;
  ceil?: string;
  pg?: string;
}

const ResultsPage = async (props: {
  searchParams: Promise<SearchParamsProps>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const category = searchParams.category || "all";
  const sort = searchParams.sort || "default";
  const brand = searchParams.brand || "all";
  const min = searchParams.min || "0";
  const max = searchParams.max || "10000";
  const currentPage = searchParams.currentPage || "1";
  const page = Number(searchParams.currentPage) || 1;

  const setURL = ({ categoryFilter, sortingFilter, brandFilter, floor, ceil, pg }: urlParams) => {
    const params = {
      query,
      category,
      sort,
      brand,
      min,
      max,
      currentPage,
    };

    if (categoryFilter) params.category = categoryFilter;
    if (sortingFilter) params.sort = sortingFilter;
    if (brandFilter) params.brand = brandFilter;
    if (floor) params.min = floor;
    if (ceil) params.max = ceil;
    if (pg) params.currentPage = pg;

    return `/results?${new URLSearchParams(params).toString()}`;
  };

  let res = await getAllSearchResults({
    query: query,
    page: page ? page : 1,
    limit: PAGE_SIZE,
    category: category !== "all" ? category : undefined,
    brand: brand !== "all" ? brand : undefined,
    min: min !== "0" ? min : undefined,
    max: max !== "10000" ? max : undefined,
    sort: sort !== "default" ? sort : undefined,
  });

  const filters = await getProductFilters(query);

  if (!filters) {
  }

  if (!res) {
    res = JSON.stringify({ data: [], totalPages: 1 });
  }
  const products: {
    data: ProductResultsCardProps[];
    totalPages: number;
    categories: string[];
  } = JSON.parse(res);

  return (
    <div className="grid md:grid-cols-4 gap-4 p-4 h-full">
      {/* Filters Start */}
      <div className="hidden md:block space-y-4 border-r">
        <div>
          <Link
            className="text-blue-500 underline text-xl"
            href={`/results?${new URLSearchParams({
              query: query,
              currentPage: "1",
            })}`}
          >
            Clear Filters
          </Link>
        </div>
        <div className="text-2xl m-0 p-0">Category</div>
        <ul className="pl-4">
          <li>
            <Link
              className={`${
                (category === "all" || category === "") && "font-bold"
              }`}
              href={setURL({ categoryFilter: "all" })}
            >
              All
            </Link>
          </li>
          {filters?.categories?.map((item) => (
            <li key={item}>
              <Link
                className={`${category === item && "font-bold"}`}
                href={setURL({ categoryFilter: item.toLowerCase() })}
              >
                {formatToTitleCase(item)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-2xl m-0 p-0">Brand</div>
        <ul className="pl-4">
          <li>
            <Link
              className={`${(brand === "all" || brand === "") && "font-bold"}`}
              href={setURL({ brandFilter: "all" })}
            >
              All
            </Link>
          </li>
          {filters?.brands?.map((item) => (
            <li key={item}>
              <Link
                className={`${brand === item.toLowerCase() && "font-bold"}`}
                href={setURL({ brandFilter: item.toLowerCase() })}
              >
                {formatToTitleCase(item)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-2xl m-0 p-0">Price</div>
        <MinMaxFilter
          query={query}
          category={category}
          sort={sort}
          brand={brand}
          min={min}
          max={max}
          page={currentPage}
        />
      </div>

      {/* Small Screen Sheet */}
      <div className="md:hidden flex justify-between gap-5">
        <Sheet>
          <div className="flex justify-between items-center gap-5 w-full">
            <div className="flex justify-start text-2xl">
              <Label htmlFor="sheet-trigger" className="text-2xl m-0 p-0">
                Filter By
              </Label>
            </div>

            <div className="flex justify-end">
              <Button id="sheet-trigger" className="px-16" asChild>
                <SheetTrigger className="align-middle">Filters</SheetTrigger>
              </Button>
            </div>
          </div>

          <SheetContent>
            <SheetTitle>Filters</SheetTitle>
            <div>
              <Link
                className="text-blue-500 underline text-xl"
                href={`/results?${new URLSearchParams({
                  query: query,
                  currentPage: "1",
                })}`}
              >
                Clear Filters
              </Link>
            </div>
            <div className="text-2xl m-0 p-0">Category</div>
            <ul className="pl-4">
              <li>
                <Link
                  className={`${
                    (category === "all" || category === "") && "font-bold"
                  }`}
                  href={setURL({ categoryFilter: "all" })}
                >
                  All
                </Link>
              </li>
              {filters?.categories?.map((item) => (
                <li key={item}>
                  <Link
                    className={`${category === item && "font-bold"}`}
                    href={setURL({ categoryFilter: item.toLowerCase() })}
                  >
                    {formatToTitleCase(item)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-2xl m-0 p-0">Brand</div>
            <ul className="pl-4">
              <li>
                <Link
                  className={`${
                    (brand === "all" || brand === "") && "font-bold"
                  }`}
                  href={setURL({ brandFilter: "all" })}
                >
                  All
                </Link>
              </li>
              {filters?.brands?.map((item) => (
                <li key={item}>
                  <Link
                    className={`${brand === item.toLowerCase() && "font-bold"}`}
                    href={setURL({ brandFilter: item.toLowerCase() })}
                  >
                    {formatToTitleCase(item)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-2xl m-0 p-0">Price</div>
            <MinMaxFilter
              query={query}
              category={category}
              sort={sort}
              brand={brand}
              min={min}
              max={max}
              page={currentPage}
            />
          </SheetContent>
        </Sheet>
      </div>
      {/* Filters End */}

      <div className="space-y-4 md:flex md:flex-col md:gap-4 md:col-span-3">
        <SortingOptions sortMethod={sort || "Default"} />

        <div className="flex flex-col grow gap-2 ">
          {products?.data?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <h1 className="h2-bold">No Products Found</h1>
              <p className="text-md text-gray-500 dark:text-gray-400">
                No products found for the search term &#34;{query}&#34;. Please
                try a different search term or update your filters.
              </p>
            </div>
          )}

          {products?.data?.map((item) => (
            <Link key={item._id.toString()} href={`/result/${item._id}`}>
              <ResultCard
                name={item.name}
                images={item.images}
                brand={item.brand}
                price={item.price}
                average_rating={item.average_rating}
                height={250}
                width={250}
              />
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-end mt-4">
          {products?.totalPages && products?.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={setURL({ pg: `${page - 1}` })}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: products.totalPages }, (_, index) => {
                  return (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        href={setURL({ pg: `${index + 1}` })}
                        isActive={page === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href={setURL({
                      pg:
                        page !== products.totalPages
                          ? `${page + 1}`
                          : `${products.totalPages}`,
                    })}
                    className={
                      page === products.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
