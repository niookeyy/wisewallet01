import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const OnboardingPage = () => {
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isOnboarded, refreshProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/", { replace: true });
        return;
      }
      if (isOnboarded) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, isOnboarded, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const numericIncome = Number(income.replace(/[^0-9]/g, ""));
    if (!numericIncome || numericIncome <= 0) {
      setError("Masukkan pendapatan bulanan yang valid.");
      return;
    }

    if (!user || !user.id) {
      setError("Sesi tidak ditemukan. Silakan masuk kembali.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        total_income: numericIncome,
        balance_primer: Math.round(numericIncome * 0.5),
        balance_sekunder: Math.round(numericIncome * 0.3),
        balance_cold_fund: Math.round(numericIncome * 0.2),
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refreshProfile();
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-5 py-10">
      <div className="mx-auto max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Langkah pertama</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Isi pendapatanmu</h1>
          <p className="mx-auto max-w-xs text-sm text-slate-400">
            Supabase akan menyimpan profil Anda dan mengarahkan ke dashboard saat onboarding selesai.
          </p>
        </div>

        <Card className="overflow-hidden border border-white/10 bg-slate-900/95 shadow-2xl shadow-slate-950/40">
          <CardHeader className="space-y-3">
            <CardTitle>Onboarding Pendapatan</CardTitle>
            <CardDescription>Masukkan nilai pendapatan bulanan untuk melanjutkan ke dashboard Wise Wallet.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Pendapatan bulanan</label>
                <Input
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                  placeholder="Contoh: 5000000"
                  type="text"
                  disabled={loading}
                />
              </div>
              {error ? <p className="text-sm text-danger text-danger-foreground">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan dan lanjutkan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
