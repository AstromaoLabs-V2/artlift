
import { Artwork } from "@/types/props";
import { apiArtist } from "../api";

export const artworkAPI ={
    list: () =>
        apiArtist("/artworks/"),

    get: (id: number | string) =>
        apiArtist(`/artwork/${id}/`),

    create: (data: FormData) =>
        apiArtist("/artwork/create/", {
      method: "POST",
      body: data,
    }),

    update: (id: number | string, data:Partial<Artwork>) =>
    apiArtist(`/artwork/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

    delete: (id: number | string): Promise<void> =>
    apiArtist(`/artwork/${id}/`, {
      method: "DELETE",
    }),
}