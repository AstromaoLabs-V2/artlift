import { Artist } from "@/types/props";
import { apiClient } from "../api";

export const artistAPI ={
    list: () =>
        apiClient("/artists/"),

    get: (id: number | string) =>
        apiClient(`/artist/${id}/`),

    create: (data: Artist) =>
        apiClient("/artist/create/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

    update: (id: number | string, data: Artist) =>
    apiClient(`/artist/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

      delete: (id: number | string): Promise<void> =>
    apiClient(`/artist/${id}/`, {
      method: "DELETE",
    }),
}