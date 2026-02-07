
import {Comments} from "@/types/props";
import { apiArtist } from "../api";

export const commentAPI ={
   
    get: (id: number | string) =>
        apiArtist(`/artwork/${id}/comments/`),

    Commentcreate: (id: number | string, data: FormData) =>
      apiArtist(`/artwork/${id}/comments/create/`, {
      method: "POST",
      body: data,
      headers:{},
    }),

      Replycreate: (id: number |string, data: FormData) =>
        apiArtist(`/comments/${id}/reply/`, {
      method: "POST",
      body: data,
      headers:{},
    }),


    delete: (id: number | string): Promise<void> =>
    apiArtist(`/comments/${id}/delete/`, {
      method: "DELETE",
    }),
}