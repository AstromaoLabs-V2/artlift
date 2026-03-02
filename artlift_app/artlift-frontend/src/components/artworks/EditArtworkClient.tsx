"use client";

import { Artwork, Error} from "@/types/props";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface EditArtworkFormProps {
  artwork: Artwork;
}

export default function EditArtworkForm({ artwork }: EditArtworkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: artwork.title || "",
    description: artwork.description || "",
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(artwork.img || "");
  const [errors, setErrors] = useState<Error>({});

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
        `${process.env.NEXT_PUBLIC_API_URL}/artwork/${artwork.id}/`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error("Failed to update artwork.");
        setErrors(data);
        return;
      }

      toast.success("Artwork updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/me");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrors({ general: "An unexpected error occurred." });
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <h1>Edit Artwork</h1>
      <p className="text-gray-600 mb-6">Update your artwork information</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field>
          <FieldLabel>Artwork Image</FieldLabel>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border mb-3">
            {imgPreview ? (
              <Image src={imgPreview} alt="Artwork preview" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Upload image
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

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" value={formData.title} onChange={handleChange} />
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

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
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