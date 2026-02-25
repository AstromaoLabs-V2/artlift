
import {Comments} from "@/types/props";
import { apiClient } from "../api";

export const commentAPI ={
   
    get: (id: number | string) =>
        apiClient(`/artwork/${id}/comments/`),

    commentCreate: (id: number | string, data: FormData) =>
      apiClient(`/artwork/${id}/comments/create/`, {
      method: "POST",
      body: data,
      headers:{},
    }),

      replyCreate: (id: number |string, data: FormData) =>
        apiClient(`/comments/${id}/reply/`, {
      method: "POST",
      body: data,
      headers:{},
    }),


    delete: (id: number | string): Promise<void> =>
   apiClient(`/comments/${id}/delete/`, {
      method: "DELETE",
    }),
}