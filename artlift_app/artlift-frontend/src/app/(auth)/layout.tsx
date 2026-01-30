import { cookies } from "next/headers";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return (
   <div className="flex items-center justify-center py-4 lg:h-screen">
      {children}
    </div>
  );
}
