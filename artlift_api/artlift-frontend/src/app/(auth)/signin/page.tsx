import SignInComponent from "@/components/auth/signin";
import { constructMetadata } from "@/types/props";
import { verifyJWT } from "@/utils/auth";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = constructMetadata({
  title: "Sign In | Artlift",
  description: "Sign in to your account",
  canonical: "/signin",
});

export default async function Signin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  if (token) {
    const valid = await verifyJWT(token);
    if (valid) {
      redirect("/sample");
    } else {
      cookieStore.delete("access_token");
    }
  }

  return <SignInComponent />;
}
