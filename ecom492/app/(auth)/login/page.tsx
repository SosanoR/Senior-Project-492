import LoginForm from "@/components/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logo from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = async (props: {
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
          <Logo />
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
