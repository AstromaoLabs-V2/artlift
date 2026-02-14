"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Artwork } from "@/types/props";
import { artworkAPI } from "@/lib/artwork/artwork";


type Props = {
  artistId: string;
};
export default function CreateArtworkForm({ artistId }: Props) {
    const router = useRouter();
  const [form, setForm] = useState<Partial<Artwork>>({
    title: "",
    size: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return alert("Image file is required.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title ?? "");
      formData.append("size", form.size ?? "");
      formData.append("description", form.description ?? "");
      formData.append("image", file);
      formData.append("artist", artistId);
      const created = await artworkAPI.create(formData);
      router.push(`/artist/${artistId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create artwork.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="border-4 border-indigo-500 p-6 rounded-lg space-y-4">
      <h2 className="font-bold text-xl">Create Artwork</h2>

      {/* Title */}
      <div>
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={form.title ?? ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Size */}
      <div>
        <label className="block font-semibold">Size</label>
        <input
          type="text"
          name="size"
          value={form.size ?? ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block font-semibold">Artwork Image *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="border p-2 rounded w-full"
        />
        {file && <p className="text-sm text-green-600 mt-1">Selected: {file.name}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600"
      >
        {loading ? "Creating..." : "Create Artwork"}
      </button>
    </form>
  );
}
