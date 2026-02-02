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

export async function apiArtist(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentApi = {
  createCheckoutSession: (artworkId: string) =>
    api.post("/payments/orders/create_checkout_session/", {
      artwork_id: artworkId,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/artworks/${artworkId}`,
    }),

  getOrders: () => api.get("/payments/orders/"),

  getOrder: (id: string) => api.get(`/payments/orders/${id}/`),

  refundOrder: (id: string, reason?: string) =>
    api.post(`/payments/orders/${id}/refund/`, { reason }),
};
