"use client";

import { Artist, Error } from "@/types/props";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner"

interface EditProfileProps {
  initialData: Artist;
}

export default function EditProfileComponent({ initialData }: EditProfileProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Error>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: initialData.email || "",
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    address: initialData.address || "",
    about: initialData.about || "",
    website_URL: initialData.website_URL || "",
    social_links: initialData.social_links || "",
    accept_commisions: initialData.accept_commisions ?? false,
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(initialData.img || "");
  const [bgPreview, setBgPreview] = useState<string>(initialData.bg || "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    if (formData.email && !formData.email.includes("@")) {
      setErrors({ email: "Invalid email address" });
      setLoading(false);
      return;
    }

    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) body.append(key, value.toString());
      });
      if (imgFile) body.append("img", imgFile);
      if (bgFile) body.append("bg", bgFile);

      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("access_token="))
        ?.split("=")[1];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artist/${initialData.id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data);
        return;
      }
      toast.success("Profile updated successfully!");
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/me");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ general: "Something went wrong" });
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <h1 className="text-3xl font-bold mb-1">Edit Profile</h1>
      <p className="text-gray-600 mb-6">Update your artist information</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Field>
            <FieldLabel>Background Image</FieldLabel>
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border mb-3">
              {bgPreview ? (
                <img src={bgPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Upload cover photo
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleBgChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>Profile Image</FieldLabel>
            <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {imgPreview ? (
                <img src={imgPreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Upload icon
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
              />
            </div>
          </Field>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-y"
              />
            </Field>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg shadow-sm space-y-3">
            <h3 className="font-medium text-gray-600">Social Links</h3>
            <Input
              name="social_links"
              placeholder="Twitter, Instagram, LinkedIn..."
              value={formData.social_links}
              onChange={handleChange}
            />
          </div>

          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-600 mb-2">Accept Commissions</h3>
            <div className="flex gap-2">
              <Button
                variant={formData.accept_commisions ? "default" : "outline"}
                onClick={() => setFormData(prev => ({ ...prev, accept_commisions: true }))}
              >
                Yes
              </Button>
              <Button
                variant={!formData.accept_commisions ? "default" : "outline"}
                onClick={() => setFormData(prev => ({ ...prev, accept_commisions: false }))}
              >
                No
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex gap-3 mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/me")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}