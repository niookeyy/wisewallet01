import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated, isOnboarded, refreshProfile } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(isOnboarded ? "/dashboard" : "/onboarding", { replace: true });
    }
  }, [authLoading, isAuthenticated, isOnboarded, navigate]);

  const validateForm = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Alamat email tidak valid.");
      return false;
    }
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return false;
    }
    return true;
  };

  const createOrUpdateProfile = async (userId: string, emailValue: string) => {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, email: emailValue, updated_at: new Date().toISOString() });

    if (profileError) {
      console.error("Gagal membuat/memperbarui profil:", profileError.message);
    }
  };

  const getProfileStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .maybeSingle();

    return profile?.onboarding_completed ?? false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        const user = data.user ?? data.session?.user;
        if (!user) {
          setError("Gagal masuk, coba lagi.");
          return;
        }

        await createOrUpdateProfile(user.id, user.email ?? email);
        await refreshProfile();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        const user = data.user ?? data.session?.user;
        if (!user) {
          setMessage("Akun dibuat. Silakan lanjutkan ke onboarding setelah verifikasi jika diperlukan.");
          return;
        }

        await createOrUpdateProfile(user.id, user.email ?? email);
        await refreshProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
            <span>Wise Wallet</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Selamat datang</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Kembali ke pengelolaan keuangan</h1>
            <p className="mx-auto max-w-xs text-sm text-slate-400">
              Masuk atau daftar baru untuk mulai mencatat pendapatan, tujuan tabungan, dan pengeluaran harian dengan aman.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border border-white/10 bg-slate-900/95 shadow-2xl shadow-slate-950/40">
          <CardHeader className="space-y-2">
            <div className="grid grid-cols-2 rounded-full bg-slate-800 p-1">
              {[
                { label: "Masuk", value: true },
                { label: "Daftar Baru", value: false },
              ].map((option) => (
                <button
                  type="button"
                  key={option.label}
                  onClick={() => setIsLogin(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isLogin === option.value
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <CardTitle>{isLogin ? "Masuk ke Wise Wallet" : "Daftar akun baru"}</CardTitle>
              <CardDescription>
                {isLogin
                  ? "Masukkan email dan password untuk melanjutkan ke dashboard." 
                  : "Buat akun baru untuk mulai menggunakan Wise Wallet dan isi onboarding pendapatan."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Email</label>
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contoh@domain.com"
                  type="email"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Password</label>
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimal 6 karakter"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  disabled={loading}
                />
              </div>
              {error ? <p className="text-sm text-destructive-foreground text-danger">{error}</p> : null}
              {message ? <p className="text-sm text-slate-300">{message}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mohon tunggu..." : isLogin ? "Masuk" : "Daftar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <p className="text-center text-sm text-slate-400">
              Dengan melanjutkan, Anda menyetujui penggunaan data untuk pengalaman Wise Wallet yang lebih baik.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
