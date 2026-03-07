"use server"  

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getDiscover = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/discover/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Discover fetch failed:", error);
    return {
      artists: [],
      artworks: [],
    };
  }
};

export const getAllArtworks = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artworks/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch artworks");
    }

    const data = await res.json();

    const artworks = Array.isArray(data) ? data : data?.results ?? [];

    return artworks;
  } catch (error) {
    console.error("Fetch artworks failed:", error);
    return [];
  }
};

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}


export async function apiClient(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
          ...(options.body instanceof FormData
        ? {} 
        : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }
  if (res.status === 204) {
    return null;
  }
  

  return res.json();
}


// import { cookies } from "next/headers";
// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

// export const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });




// export const paymentApi = {
//   createCheckoutSession: (artworkId: string) =>
//     api.post("/payments/orders/create_checkout_session/", {
//       artwork_id: artworkId,
//       success_url: `${window.location.origin}/success`,
//       cancel_url: `${window.location.origin}/artworks/${artworkId}`,
//     }),

//   getOrders: () => api.get("/payments/orders/"),

//   getOrder: (id: string) => api.get(`/payments/orders/${id}/`),

//   refundOrder: (id: string, reason?: string) =>
//     api.post(`/payments/orders/${id}/refund/`, { reason }),
// };
