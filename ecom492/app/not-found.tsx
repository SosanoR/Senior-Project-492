"use client";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Logo />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
