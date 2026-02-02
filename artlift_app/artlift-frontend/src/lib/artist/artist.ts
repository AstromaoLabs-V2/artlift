import { Artist } from "@/types/props";
import { apiArtist } from "../api";

export const artistAPI ={
    list: () =>
        apiArtist("/artists/"),

    get: (id: number | string) =>
        apiArtist(`/artist/${id}/`),

    create: (data: Artist) =>
        apiArtist("/artist/create/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

    update: (id: number | string, data: Artist) =>
    apiArtist(`/artist/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

      delete: (id: number | string): Promise<void> =>
    apiArtist(`/artist/${id}/`, {
      method: "DELETE",
    }),
}