import { apiFetch } from "./api";

// CREATE user
export const createUser = (data) =>
  apiFetch("/users/", {
    method: "POST",
    body: JSON.stringify(data),
  });

// READ all users
export const getUsers = () =>
  apiFetch("/users/");

// READ single user
export const getUser = (id) =>
  apiFetch(`/users/${id}/`);

// UPDATE user
export const updateUser = (id, data) =>
  apiFetch(`/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// DELETE user
export const deleteUser = (id) =>
  apiFetch(`/users/${id}/`, {
    method: "DELETE",
  });
