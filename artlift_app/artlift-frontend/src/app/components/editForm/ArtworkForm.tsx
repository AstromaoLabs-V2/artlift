"use client";

import { useState } from "react";
import { Artwork } from "@/app/types/props";
import { editArtwork } from "@/app/lib/Artists/[id]/editArtwork";
import { createArtwork } from "@/app/lib/Artists/[id]/postArtwork";

type Props = {
  artwork?: Artwork;
  token: string;
  mode: "create" | "edit";
  onUpdated: (artwork: Artwork) => void;
};

export default function ArtworkForm({
  artwork,
  token,
  mode,
  onUpdated,
}: Props) {
  const [artworkForm, setArtworkForm] = useState<Partial<Artwork>>({
    title: artwork?.title ?? "",
    size: artwork?.size ?? "",
    description: artwork?.description ?? "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setArtworkForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "edit") {
        if (!artwork) {
          throw new Error("Artwork data is required for edit mode.");
        }
        const updated = await editArtwork(artwork.id, token, artworkForm);
        onUpdated(updated);
        alert("Artwork updated successfully!");
      } else {
        if (!selectedFile) {
          throw new Error("Image file is required for creating artwork.");
        }
        const created = await createArtwork(token, selectedFile, artworkForm);
        onUpdated(created);
        alert("Artwork created successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save artwork.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border-4 border-indigo-500 rounded-lg"
    >
      <h2 className="font-bold text-lg">
        {mode === "edit" ? "Edit Artwork" : "Create Artwork"}
      </h2>

      <input
        name="title"
        value={artworkForm.title ?? ""}
        onChange={handleChange}
        placeholder="Artwork Title"
        className="border-4 border-indigo-500 p-2 rounded"
        required
      />

      <input
        name="size"
        value={artworkForm.size ?? ""}
        onChange={handleChange}
        placeholder="Size (e.g., 50x70cm)"
        className="border-4 border-indigo-500 p-2 rounded"
      />

      <textarea
        name="description"
        value={artworkForm.description ?? ""}
        onChange={handleChange}
        placeholder="Description"
        className="border-4 border-indigo-500 p-2 rounded"
        rows={5}
      />

      {mode === "create" && (
        <div>
          <label className="block font-semibold mb-2">Artwork Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-4 border-indigo-500 p-2 rounded"
            required
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading
          ? "Loading..."
          : mode === "edit"
            ? "Save Changes"
            : "Create Artwork"}
      </button>
    </form>
  );
}
