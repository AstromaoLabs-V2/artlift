import SignInComponent from "@/components/auth/signin";
import { constructMetadata } from "@/types/props";
import { verifyJWT } from "@/utils/auth";
import { GalleryVerticalEnd, PaintBucket } from "lucide-react";
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
      redirect("/home");
    } else {
      cookieStore.delete("access_token");
    }
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
        <SignInComponent/>
      </div>
    </div>
  )
}
