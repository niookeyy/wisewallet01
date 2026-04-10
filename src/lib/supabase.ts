import { createClient } from "@supabase/supabase-js";

// Pastikan ini HANYA VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Koneksi Supabase Gagal: Variabel VITE tidak ditemukan di .env.local atau Vercel");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");