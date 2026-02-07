"use client";

import { useState } from "react";
import{useRouter} from "next/navigation";
import { Artwork } from "@/types/props";
import { artworkAPI } from "@/lib/artwork/artwork";
import DeleteButton from "@/components/DeleteButton";

type Props = {
  artwork: Artwork;
};

export default function EditArtworkForm({ artwork}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<Partial<Artwork>>({
    title: artwork.title,
    size: artwork.size,
    description: artwork.description,
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
    setLoading(true);

    try {
      let payload: any = form;

      if (file) {
        // optional for editing
        const formData = new FormData();
        formData.append("title", form.title ?? "");
        formData.append("size", form.size ?? "");
        formData.append("description", form.description ?? "");
        formData.append("image", file);
        payload = formData;
      }
      else {
        payload = {
          title: form.title,
          size: form.size,
          description: form.description,
        };
      }

      const updated = await artworkAPI.update(artwork.id, payload);
      alert("Artwork updated");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await artworkAPI.delete(artwork.id);
      router.push("/artwork");
    } catch (err) {
      console.error(err);
      alert("Failed to delete artwork.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-4 border-indigo-500 p-6 rounded-lg space-y-4">
      <h2 className="font-bold text-xl">Edit Artwork</h2>

      {/* Title */}
      <div>
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
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
          value={form.size}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block font-semibold">
          Change Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        {file && <p className="text-sm text-green-600">Selected: {file.name}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <div className="pt-4">
        <DeleteButton onDelete={handleDelete} />
      </div>
    </form>
  );
}
