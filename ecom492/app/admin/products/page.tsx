import {
  getAllUserProducts,
  deleteUserProduct,
} from "@/lib/actions/product.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatNumberWithPrecision, formatToTitleCase } from "@/lib/utils";
import { userProductData } from "@/_common/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
    token: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const session = await auth();
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  if (!session) {
    return redirect("/login");
  }

  const res = await getAllUserProducts({
    query: searchText,
    // limit: 2,
    page,
    category,
    user_id: session.user?.id,
  });

  if (!res) {
    return (
      <div className="flex-between">
        <h1 className="h2-bold">No Products Found</h1>
        <Button variant="default" asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
    );
  }

  const products: { data: userProductData[]; totalPages: number } =
    JSON.parse(res);

  if (page > (products?.totalPages || 1) || page < 1) {
    return redirect("/admin/products");
  }
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button variant="default" asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>category</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.data.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product._id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                ${formatNumberWithPrecision(Number(product.price))}
              </TableCell>
              <TableCell>{formatToTitleCase(product.category)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.average_rating} stars</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product._id}`}>Modify</Link>
                </Button>

                <DeleteDialog
                  id={`${product._id}`}
                  action={deleteUserProduct}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products?.totalPages && products?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `?page=${page - 1}` : `?page=1`}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: products.totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href={`?page=${index + 1}`}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={
                  page !== products.totalPages
                    ? `?page=${page + 1}`
                    : `?page=${products.totalPages}`
                }
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
  );
};

export default AdminProductsPage;
