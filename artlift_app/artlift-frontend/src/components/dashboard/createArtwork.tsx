"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";

export default function CreateArtworkForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    size: "",
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) body.append(key, value);
      });
      if (imgFile) body.append("img", imgFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artworks/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        }
      );

      if (!res.ok) {
        toast.error("Failed to create artwork.");
        return;
      }

      toast.success("Artwork created successfully!");
      setTimeout(() => {
        router.push("/dashboard/me");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <h2>Upload Artwork</h2>
      <p className="text-gray-600 mb-6">Share your artwork with the world</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main fields */}
        <div className="lg:col-span-2 space-y-6">
          <Field>
            <FieldLabel>Artwork Image</FieldLabel>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border mb-3">
              {imgPreview ? (
                <Image src={imgPreview} alt="Artwork preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Click to upload image
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </Field>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Information</h2>

            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Size</FieldLabel>
              <Input
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. 100x100cm"
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-y"
              />
            </Field>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg shadow-sm space-y-3">
            <h3 className="font-medium text-gray-600">Artwork Details</h3>
            <p className="text-sm text-gray-400">
              Fill in the title and description to help people discover your artwork.
            </p>
          </div>
        </div>

        {/* Bottom: Submit */}
        <div className="lg:col-span-3 flex gap-3 mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Artwork"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/me")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}