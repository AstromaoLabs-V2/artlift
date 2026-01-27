import SignUpComponent from "@/components/auth/signup";
import { constructMetadata } from "@/types/props";
import { verifyJWT } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";

export const metadata: Metadata = constructMetadata({
  title: "Sign Up",
  description: "Sign up for an account",
  canonical: "/signup",
});

export default async function Signup(){
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (token) {
    const valid = await verifyJWT(token);
   if (valid) redirect("/sample");
  }

  return <SignUpComponent />;
}

