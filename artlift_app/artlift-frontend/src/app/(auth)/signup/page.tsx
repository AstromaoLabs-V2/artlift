
import SignUpComponent from "@/components/auth/signup";
import { constructMetadata } from "@/types/props";
import { verifyJWT } from "@/utils/auth";
import { PaintBucket } from "lucide-react";
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
   if (valid) redirect("/home");
  }

  return(
     <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <PaintBucket className="size-4" />
          </div>
          Artlift
        </a>
        <SignUpComponent/>
      </div>
    </div>
  );
}

