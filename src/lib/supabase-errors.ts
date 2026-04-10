const normalize = (message: string) => message.toLowerCase();

export const formatAuthErrorMessage = (message: string) => {
  const text = normalize(message);

  if (text.includes("email rate limit exceeded") || text.includes("over_email_send_rate_limit")) {
    return "Terlalu banyak percobaan daftar dalam waktu singkat. Tunggu beberapa menit lagi, atau matikan Confirm email di Supabase saat development.";
  }

  if (text.includes("invalid login credentials")) {
    return "Email atau password salah.";
  }

  return message;
};

export const formatDatabaseErrorMessage = (message: string) => {
  const text = normalize(message);

  if (text.includes('relation "profiles" does not exist')) {
    return 'Tabel "profiles" belum dibuat di database Supabase.';
  }

  if (text.includes("row-level security") || text.includes("permission denied")) {
    return 'Akses ke tabel "profiles" ditolak. Pastikan policy RLS untuk SELECT, INSERT, dan UPDATE sudah dibuat.';
  }

  return message;
};