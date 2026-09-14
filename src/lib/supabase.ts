import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // handles magic-link token in the URL
  },
});

// ── Typed helpers ──────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  status: "pending_payment" | "paid" | "fulfilled" | "cancelled" | "payment_failed";
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: ShippingAddress;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name_snapshot: string;
  price_snapshot: number;
  quantity: number;
};

export type ShippingAddress = {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string | null | undefined;
  city: string;
  state: string;
  pincode: string;
};
