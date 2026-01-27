import { cookies } from "next/headers";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {children}
    </div>
  );
}
