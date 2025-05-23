import { UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/auth";
import { signUserOut } from "@/lib/actions/user.actions";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return (
      <Button asChild>
        <Link href="/login">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0) ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 text-black"
            >
              {firstInitial.toUpperCase()}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <Link href={`/admin/products/`}>
            <DropdownMenuItem className="p-0 mb-1">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Seller Portal
              </Button>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signUserOut} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
