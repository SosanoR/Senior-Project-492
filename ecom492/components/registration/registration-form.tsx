"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registrationDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/lib/actions/user.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Slide, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

const RegistrationForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const [data, action] = useActionState(registerUser, {
    success: false,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const RegisterButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Submitting..." : "Register"}
      </Button>
    );
  };

  if (data.success) {
    toast.success(data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.theme === "light" ? "dark" : "light",
      transition: Slide,
    });
    router.push("/login");
  }

  const handleCheckbox = (
    e: CheckedState
  ) => {
    const checkbox = e.valueOf() ;
    if (typeof checkbox === "boolean") {
      setShowPassword(checkbox);
    }
  };


  return (
    <>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={registrationDefaultValues.name}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={registrationDefaultValues.email}
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
              defaultValue={registrationDefaultValues.password}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="confirmPassword"
              defaultValue={registrationDefaultValues.confirmPassword}
            />
          </div>

          <div className="flex justify-end items-center gap-2">
            <Checkbox className="p-2" onCheckedChange={(e) => handleCheckbox(e)} />
            Show Password
          </div>

          <div>
            <RegisterButton />
          </div>

          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" target="_self" className="link">
              Log in Here
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
