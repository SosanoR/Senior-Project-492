"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

const LoginForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const LoginButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Logging in..." : "Login"}
      </Button>
    );
  };

  const handleCheckbox = (
    e: CheckedState
  ) => {
    const checkbox = e.valueOf() ;
    if (typeof checkbox === "boolean") {
      setShowPassword(checkbox);
    }
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
            type={showPassword ? "text" : "password"}
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div className="flex justify-end items-center gap-2">
          <Checkbox id="showPassword" onCheckedChange={(e) => handleCheckbox(e)}/>
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
