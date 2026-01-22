import { useState } from "react";
import { Artist } from "@/app/types/props";
import { editArtist } from "@/app/lib/Artists/[id]/editArtists";

type Props = {
  artist: Artist;
  token: string;
  onUpdated: (artist: Artist) => void;
};
export default function ArtistEdit({ artist, token, onUpdated }: Props) {
  const [artistEditForm, setArtistEditForm] = useState<Partial<Artist>>({
    first_name: artist.first_name,
    last_name: artist.last_name,
    about: artist.about,
    website_URL: artist.website_URL,
    social_links: artist.social_links,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setArtistEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await editArtist(artist.id, token, artistEditForm);
      onUpdated(updated);
      alert("Artist updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update artist.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        name="first_name"
        value={artistEditForm.first_name ?? ""}
        onChange={handleChange}
        placeholder="First name"
        className="border-4 border-indigo-500"
      />

      <input
        name="last_name"
        value={artistEditForm.last_name ?? ""}
        onChange={handleChange}
        placeholder="Last name"
        className="border-4 border-indigo-500"
      />

      <textarea
        name="about"
        value={artistEditForm.about ?? ""}
        onChange={handleChange}
        placeholder="About"
        className="border-4 border-indigo-500"
      />

      <input
        name="website_URL"
        value={artistEditForm.website_URL ?? ""}
        onChange={handleChange}
        placeholder="Website"
        className="border-4 border-indigo-500"
      />

      <button type="submit">Save Changes</button>
    </form>
  );
}
