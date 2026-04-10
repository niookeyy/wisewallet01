import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Ini akan muncul di 'Inspect Element' jika masih error
  console.error("Koneksi Supabase Gagal: Variabel tidak ditemukan");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");