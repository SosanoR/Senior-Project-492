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
          <Link href="/" className="flex-center">
            Logo
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
