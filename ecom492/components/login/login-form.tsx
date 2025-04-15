"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

const LoginForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const LoginButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing in..." : "Login"}
      </Button>
    );
  };

  const handleCheckbox = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const checkbox = e.currentTarget as HTMLInputElement;
    const passwordField = document.getElementById(
      "password"
    ) as HTMLInputElement;
    checkbox.checked = !checkbox.checked;

    passwordField.type = checkbox.checked ? "text" : "password";
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div className="flex justify-end items-center gap-2">
          <Checkbox id="showPassword" onClick={handleCheckbox} />
          <Label htmlFor="showPassword" className="ml-2">
            Show Password
          </Label>
        </div>

        <div>
          <LoginButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" target="_self" className="link">
            Register Here
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
