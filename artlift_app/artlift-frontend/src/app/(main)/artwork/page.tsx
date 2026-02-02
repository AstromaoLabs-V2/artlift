"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/nav/navigation";
import ArtworkForm from "@/app/components/editForm/ArtworkForm";
import { Artwork } from "@/types/props";

export default function CreateArtworkPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);
    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!token) return <p>Loading...</p>;

  const handleArtworkCreated = (artwork: Artwork) => {
    router.push(`/artwork/${artwork.id}`);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-r from-[#9ac3c6] to-[#4d858d] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Create Artwork</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ArtworkForm
              token={token}
              mode="create"
              onUpdated={handleArtworkCreated}
            />
          </div>
        </div>
      </div>
    </>
  );
}
