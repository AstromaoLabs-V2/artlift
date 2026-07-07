
import { Artwork } from "@/types/props";
import { apiClient } from "../api";

export const artworkAPI ={
    list: () =>
        apiClient("artworks/"),

    get: (id: number | string) =>
        apiClient(`artwork/${id}/`),

    create: (data: FormData) =>
        apiClient("artworks/", {
      method: "POST",
      body: data,
    }),

    update: (id: number | string, data:Partial<Artwork>) =>
    apiClient(`artwork/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

    delete: (id: number | string): Promise<void> =>
    apiClient(`artwork/${id}/`, {
      method: "DELETE",
    }),
}