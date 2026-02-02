import Link from "next/link";

export default function NotFound({ message = "Page not found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-4">{message}</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
