"use server";

import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const res = await fetch("http://127.0.0.1:8000/signup/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }

  const data = await res.json();

  // Set cookie for server-side auth
  // Example: using 'Set-Cookie' header or Next.js cookies API
  // Here just pseudo-code:
  // cookies().set("access_token", data.tokens.access, { httpOnly: true, path: "/" });

  redirect("/dashboard/me");
}
