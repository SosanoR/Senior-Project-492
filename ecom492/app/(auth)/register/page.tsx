import RegistrationForm from "@/components/registration/registration-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register",
};

const RegistrationPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-fill max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
        <Link href="/" className="flex justify-center items-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
              className="dark:bg-white rounded-xl"
            />
          </Link>
          <CardTitle className="text-center">Register Account</CardTitle>
          <CardDescription className="text-center">
            Fill in information below to register an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;
