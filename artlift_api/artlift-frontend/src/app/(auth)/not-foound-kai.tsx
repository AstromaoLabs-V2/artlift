export default function AuthNotFound() {
  console.log("check if auth 404 page rendered");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-500">
      <div className="bg-white p-8 rounded">
        <h1 className="text-4xl font-bold">404 - Auth Not Found</h1>
        <p>This is the auth 404 page</p>
      </div>
    </div>
  );
}