import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "@/utils/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  const protectedRoutes = ["/dashboard", "/artwork", "/artist", "/sample"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    url.pathname = "/signin";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (token) {
    const valid = await verifyJWT(token);

    if (!valid) {
      const res = NextResponse.redirect(new URL("/signin", req.url));
      res.cookies.delete("access_token");
      return res;
    }

    if (req.nextUrl.pathname === "/signin") {
      const redirectTo = req.nextUrl.searchParams.get("redirect") || "/home";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/artwork/:path*",
    "/artist/:path*",
    "/sample/:path*",
    "/signin",
  ],
};
