//this is server side which functions are server actions to backend
//this is server side
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

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers:{
    'Content-Type': 'application/json',
  },
})

export const paymentApi = {
  createCheckoutSession: (artworkId: string) =>
    api.post('/payments/orders/create_checkout_session/', {
      artwork_id: artworkId,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/artworks/${artworkId}`,
    }),

  getOrders: () => api.get('/payments/orders/'),
  
  getOrder: (id: string) => api.get(`/payments/orders/${id}/`),
  
  refundOrder: (id: string, reason?: string) =>
    api.post(`/payments/orders/${id}/refund/`, { reason }),
}
