import { apiClient } from "./api";

export const categoryAPI = {
  list: () => apiClient("categories/"),
};
