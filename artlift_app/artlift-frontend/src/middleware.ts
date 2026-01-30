import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "@/utils/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  
  console.log("This for debugging auth -kai");
  console.log("Midware Checking:", req.nextUrl.pathname, "token:", token ? "exists" : "none");
  
  if (!token) {
    console.log("🔴 No Token");
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const valid = await verifyJWT(token);
  if (!valid) {
    console.log("🔴 Invalid Token");
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  console.log("✅ Success HAHAH");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/artwork/:path*",
    "/sample/:path*"  
  ], 
};