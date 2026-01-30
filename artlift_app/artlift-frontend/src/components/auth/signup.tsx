"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Errors } from "@/types/props";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export default function SignUpComponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result as Errors);
        return;
      }

      console.log("User created:", result.user);
      console.log("Tokens:", result.tokens);

      setSuccess(true);
    } catch (err) {
      setErrors({ error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getError = (field: keyof Errors): string | undefined => {
    const error = errors[field];
    if (Array.isArray(error)) {
      return error[0];
    }
    return error;
  };

  if (success) {
    return <div>account created for toast notif -kai</div>;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 mx-auto w-96">
         <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
          <CardContent className="px-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="input-field-username"
                  className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Username
                </Label>
                <Field data-invalid={!!getError("username")}>
                  <Input
                    id="input-field-username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-invalid={!!getError("username")}
                  />
                  {getError("username") && (
                    <FieldDescription>{getError("username")}</FieldDescription>
                  )}
                </Field>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="input-field-email"
                  className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Email
                </Label>
                <Field data-invalid={!!getError("email")}>
                  <Input
                    id="input-field-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!getError("email")}
                  />
                  {getError("email") && (
                    <FieldDescription>{getError("email")}</FieldDescription>
                  )}
                </Field>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="input-field-password"
                  className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Password
                </Label>
                <Field data-invalid={!!getError("password")}>
                  <Input
                    id="input-field-password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!getError("password")}
                  />
                  {getError("password") && (
                    <FieldDescription>{getError("password")}</FieldDescription>
                  )}
                </Field>
              </div>
              <Button onClick={handleSignup} disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                  Already have an account? <a className="underline"href="/signin">Sign in</a>
            </div>
          </CardContent>
        </Card>
      </form>
       <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
