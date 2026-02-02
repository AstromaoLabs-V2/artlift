import { useState } from "react";
import { Artist } from "@/types/props";
import { editArtist } from "@/app/lib/Artists/[id]/editArtists";
import { createArtist } from "@/app/lib/Artists/[id]/postArtists";

type Props = {
  artist?: Artist;
  token: string;
  mode:"create" | "edit";
  onUpdated: (artist: Artist) => void;
};
export default function ArtistForm({ artist, mode, onUpdated }: Props) {
  const [artistEditForm, setArtistEditForm] = useState<Partial<Artist>>({
    first_name: artist?.first_name ?? "",
    last_name: artist?.last_name ?? "",
    address: artist?.address ?? "",
    about: artist?.about ?? "",
    accept_commisions: artist?.accept_commisions ?? false,
    website_URL: artist?.website_URL ?? "",
    img: artist?.img ?? "",
    bg: artist?.bg ?? "",
    social_links: artist?.social_links ?? "",
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
      console.log("SUBMIT BODY 👉", artistEditForm); 

    try {

      if (mode==="edit"){
        if(!artist){
          throw new Error("Artist data is required for edit mode.");
        }
           const updated = await editArtist(artist.id, token, artistEditForm);
      onUpdated(updated);
      alert("Artist updated successfully!");
    } 
    else{
      const created = await createArtist(token, artistEditForm);
      onUpdated(created);
      alert("Artist created successfully!");
    }
    }
    catch(error){
      console.error(error);
      alert("Failed to save artist.");
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

      <input
        name="address"
        value={artistEditForm.address ?? ""}
        onChange={handleChange}
        placeholder="Address"
        className="border-4 border-indigo-500"
      />

      <textarea
        name="about"
        value={artistEditForm.about ?? ""}
        onChange={handleChange}
        placeholder="About"
        className="border-4 border-indigo-500"
      />

<p>Commission</p>
  <button
  type="button"
  onClick={() =>
    setArtistEditForm((prev) => ({
      ...prev,
      accept_commisions: !prev.accept_commisions,
    }))
  }
  className="px-4 py-2 border rounded"
>
  {artistEditForm.accept_commisions ? "Yes" : "No"}
</button>

      <input
        name="img"
        value={artistEditForm.img ?? ""}
        onChange={handleChange}
        placeholder="Image URL"
        className="border-4 border-indigo-500"
      />

      <input
        name="bg"
        value={artistEditForm.bg ?? ""}
        onChange={handleChange}
        placeholder="Background Image URL"
        className="border-4 border-indigo-500"
      />

      <input
        name="website_URL"
        value={artistEditForm.website_URL ?? ""}
        onChange={handleChange}
        placeholder="Website"
        className="border-4 border-indigo-500"
      />

      <input 
        name="social_links"
        value={artistEditForm.social_links ?? ""}
        onChange={handleChange}
        placeholder="Social Links"
        className="border-4 border-indigo-500"
      />

      <button type="submit">{mode==="edit" ?"Save Changes" : "Create Artist"}</button>
    </form>
  );
}
