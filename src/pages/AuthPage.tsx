import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatAuthErrorMessage, formatDatabaseErrorMessage } from "@/lib/supabase-errors";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
    if (!isLogin && username.trim().length === 0) {
      setError("Username harus diisi.");
      return false;
    }
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return false;
    }
    return true;
  };

  // ✅ NON-BLOCKING (tidak bikin loading lama)
  const createOrUpdateProfile = async (
    userId: string,
    emailValue: string,
    usernameValue?: string
  ) => {
    try {
      const profileData: {
        id: string;
        email: string;
        updated_at: string;
        username?: string;
      } = {
        id: userId,
        email: emailValue,
        updated_at: new Date().toISOString(),
      };

      if (usernameValue) {
        profileData.username = usernameValue;
      }

      const { error } = await supabase.from("profiles").upsert(profileData, {
        onConflict: "id",
      });

      if (error) {
        console.error("Profile error:", error.message);
      }
    } catch (err) {
      console.error("Unexpected profile error:", err);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Auth form submit", { isLogin, email });
    setError(null);
    setMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(formatAuthErrorMessage(signInError.message));
          return;
        }

        const user = data.user ?? data.session?.user;
        if (!user) {
          setError("Gagal masuk, coba lagi.");
          return;
        }

        // ✅ JALANKAN DI BACKGROUND (tidak di-await)
        createOrUpdateProfile(user.id, user.email ?? email, username || undefined);

        // ✅ refresh juga tidak blocking
        refreshProfile();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          setError(formatAuthErrorMessage(signUpError.message));
          return;
        }

        const user = data.user ?? data.session?.user;

        if (!user) {
          setMessage("Akun dibuat! Cek email untuk verifikasi, lalu masuk.");
          return;
        }

        if (data.session) {
          // ✅ background juga
          createOrUpdateProfile(user.id, user.email ?? email, username || undefined);
          refreshProfile();

          navigate("/onboarding", { replace: true });
          return;
        }

        setMessage("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false); // 🔥 ini penting (sudah benar)
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
            <span>💰 Wise Wallet</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Selamat datang</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Kelola Keuanganmu</h1>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground mt-2">
              Masuk atau daftar baru untuk mulai mencatat pendapatan, tujuan tabungan, dan pengeluaran harian dengan aman.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border border-border bg-card shadow-2xl">
          <CardHeader className="space-y-2">
            <div className="grid grid-cols-2 rounded-full bg-secondary p-1">
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
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
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
                  ? "Masukkan email dan password untuk melanjutkan."
                  : "Buat akun baru, lalu isi onboarding pendapatan."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Masukkan username"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  disabled={loading}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-green-500">{message}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mohon tunggu..." : isLogin ? "Masuk" : "Daftar"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground">
              Dengan melanjutkan, Anda menyetujui penggunaan data.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;