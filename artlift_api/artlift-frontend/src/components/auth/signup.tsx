"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Errors } from "@/types/props";
import { useState } from "react";

export default function SignUpComponent() {
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
      [name]: undefined
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
      setErrors({ error: 'Network error. Please try again.' }); 
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
    <div>
      <form>
        <Field data-invalid={!!getError('username')}> 
          <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
          <Input
            id="input-field-username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            aria-invalid={!!getError('username')}
          />
          {getError('username') && (
            <FieldDescription>{getError('username')}</FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!getError('email')}>
          <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
          <Input
            id="input-field-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!getError('email')}
          />
          {getError('email') && (
            <FieldDescription>{getError('email')}</FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!getError('password')}>
          <FieldLabel htmlFor="input-field-password">Password</FieldLabel>
          <Input
            id="input-field-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            aria-invalid={!!getError('password')}
          />
          {getError('password') && (
            <FieldDescription>{getError('password')}</FieldDescription>
          )}
        </Field>

        <Button onClick={handleSignup} disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </div>
  );
}