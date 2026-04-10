import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDatabaseErrorMessage } from "@/lib/supabase-errors";

const OnboardingPage = () => {
  const [income, setIncome] = useState("");
  const [primer, setPrimer] = useState("");
  const [sekunder, setSekunder] = useState("");
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

  useEffect(() => {
    if (profile) {
      if (!income && profile.total_income) {
        setIncome(String(profile.total_income));
      }
      if (!primer && profile.balance_primer) {
        setPrimer(String(profile.balance_primer));
      }
      if (!sekunder && profile.balance_sekunder) {
        setSekunder(String(profile.balance_sekunder));
      }
    }
  }, [profile, income, primer, sekunder]);

  // Hitung sisa untuk Dana Dingin secara real-time
  const totalIncome = Number(income) || 0;
  const danaPrimer = Number(primer) || 0;
  const danaSekunder = Number(sekunder) || 0;
  const danaDingin = totalIncome - (danaPrimer + danaSekunder);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (totalIncome <= 0) {
      setError("Masukkan pendapatan bulanan yang valid.");
      return;
    }

    if (danaDingin < 0) {
      setError("Total alokasi melebihi pendapatan bulanan Anda!");
      return;
    }

    if (!user?.id) {
      setError("Sesi tidak ditemukan. Silakan masuk kembali.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email ?? null,
        total_income: totalIncome,
        balance_primer: danaPrimer,
        balance_sekunder: danaSekunder,
        balance_cold_fund: danaDingin,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

    setLoading(false);

    if (updateError) {
      setError(formatDatabaseErrorMessage(updateError.message));
      return;
    }

    await refreshProfile();
    navigate("/dashboard", { replace: true });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID").format(val);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-5 py-10">
      <div className="mx-auto max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Kustomisasi Keuangan</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Atur Alokasimu</h1>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Tentukan sendiri jatah dana primer dan sekundermu. Sisanya akan otomatis masuk ke Dana Dingin.
          </p>
        </div>

        <Card className="overflow-hidden border border-border bg-card shadow-2xl">
          <CardHeader>
            <CardTitle>Onboarding Pendapatan</CardTitle>
            <CardDescription>Sesuaikan alokasi dana bulanan Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Input Pendapatan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Pendapatan (Rp)</label>
                  <Input
                    value={income}
                    onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 5000000"
                    type="text"
                    disabled={loading}
                  />
                </div>

                {/* Input Dana Primer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alokasi Dana Primer (Kebutuhan)</label>
                  <Input
                    value={primer}
                    onChange={(e) => setPrimer(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 2500000"
                    type="text"
                    disabled={loading}
                  />
                </div>

                {/* Input Dana Sekunder */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alokasi Dana Sekunder (Keinginan)</label>
                  <Input
                    value={sekunder}
                    onChange={(e) => setSekunder(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 1500000"
                    type="text"
                    disabled={loading}
                  />
                </div>

                {/* Kalkulasi Dana Dingin Otomatis */}
                <div className={`p-4 rounded-lg border ${danaDingin < 0 ? 'bg-destructive/10 border-destructive' : 'bg-primary/5 border-primary/20'}`}>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Dana Dingin (Tabungan Otomatis)</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {formatCurrency(danaDingin)}
                  </p>
                  {danaDingin < 0 && (
                    <p className="text-xs text-destructive mt-1 font-medium italic">Peringatan: Alokasi melebihi pendapatan!</p>
                  )}
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={loading || danaDingin < 0}
              >
                {loading ? "Menyimpan..." : "Simpan dan Buka Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;