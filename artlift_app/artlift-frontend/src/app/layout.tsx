import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { constructMetadata } from "@/types/props";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata({
  title: "Artlift",
  description: "Art, Elevated.",
  canonical: "/home",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-r from-[#9ac3c6] to-[#4d858d]`}
      > */}
        <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
          {children}
          <Toaster/>
          </ThemeProvider>
      </body>
    </html>
  );
}
