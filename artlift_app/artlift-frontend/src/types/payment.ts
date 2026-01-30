export interface Order {
  id: string
  user: number
  artist_id: string
  artwork_id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  total_amount: string
  currency: string
//   shipping_name: string
//   shipping_email: string
//   shipping_address_line1: string
//   shipping_address_line2: string
//   shipping_city: string
//   shipping_state: string
//   shipping_postal_code: string
//   shipping_country: string
  stripe_payment_intent_id: string
  stripe_checkout_session_id: string
  payments: Payment[]
  refunds: Refund[]
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  stripe_payment_intent_id: string
  amount: string
  currency: string
  status: string
  payment_method_type: string
  card_last4: string
  card_brand: string
  created_at: string
}

export interface Refund {
  id: string
  stripe_refund_id: string
  amount: string
  currency: string
  reason: string
  status: string
  created_at: string
}