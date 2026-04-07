import { useState } from "react";
import { ScanLine, Clock, Zap, CheckCircle, ArrowLeft } from "lucide-react";

type Step = "scan" | "amount" | "category" | "delay" | "success";

const ScanPage = () => {
  const [step, setStep] = useState<Step>("scan");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"primer" | "sekunder" | null>(null);

  const numericAmount = parseInt(amount.replace(/\D/g, "")) || 0;
  const roundedUp = Math.ceil(numericAmount / 500) * 500;
  const diff = roundedUp - numericAmount;
  const adminFee = Math.round(diff * 0.1);
  const userSaving = diff - adminFee;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const reset = () => {
    setStep("scan");
    setAmount("");
    setCategory(null);
  };

  if (step === "success") {
    return (
      <div className="px-5 pt-20 pb-28 max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center animate-slide-up">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Transaksi Berhasil!</h2>
        <p className="text-sm text-muted-foreground mb-4">{formatCurrency(roundedUp)} telah dibayarkan.</p>
        {diff > 0 && (
          <div className="glass-card rounded-xl p-4 w-full">
            <p className="text-sm text-primary font-semibold">
              🎉 Disiplin terjaga! Kamu baru saja menabung {formatCurrency(userSaving)} hari ini.
            </p>
          </div>
        )}
        <button onClick={reset} className="mt-6 gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-fab transition-transform active:scale-95">
          Selesai
        </button>
      </div>
    );
  }

  if (step === "delay") {
    return (
      <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-6 animate-slide-up">
        <button onClick={() => setStep("category")} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="gradient-accent rounded-2xl p-6 text-accent-foreground text-center">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-lg font-bold mb-1">Jeda Psikologis Aktif</h2>
          <p className="text-sm opacity-80">Transaksi ini masuk kategori Sekunder.</p>
          <p className="text-sm opacity-80">Tahan dulu, pikirkan 24 jam.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setStep("success")}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Tunggu 24 Jam</p>
              <p className="text-xs text-muted-foreground">Gratis — biarkan emosi belanja mendingin.</p>
            </div>
          </button>

          <button
            onClick={() => setStep("success")}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 border border-accent/30 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Fast Track — Rp500</p>
              <p className="text-xs text-muted-foreground">Bayar penalti dari Dana Dingin, proses instan.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === "category") {
    return (
      <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-6 animate-slide-up">
        <button onClick={() => setStep("amount")} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-1">Pilih Kategori</h2>
          <p className="text-sm text-muted-foreground">Transaksi {formatCurrency(numericAmount)}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { setCategory("primer"); setStep("success"); }}
            className="w-full gradient-primary text-primary-foreground rounded-2xl p-6 text-left transition-transform active:scale-[0.98]"
          >
            <p className="text-lg font-bold">🛒 Kebutuhan Primer</p>
            <p className="text-sm opacity-80 mt-1">Makan, transport, kebutuhan pokok</p>
          </button>

          <button
            onClick={() => { setCategory("sekunder"); setStep("delay"); }}
            className="w-full gradient-accent text-accent-foreground rounded-2xl p-6 text-left transition-transform active:scale-[0.98]"
          >
            <p className="text-lg font-bold">☕ Jajan Sekunder</p>
            <p className="text-sm opacity-80 mt-1">Nongkrong, hiburan, keinginan</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === "amount") {
    return (
      <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-6 animate-slide-up">
        <button onClick={() => setStep("scan")} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-1">Masukkan Nominal</h2>
          <p className="text-sm text-muted-foreground">Berapa yang harus dibayar?</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <label className="text-xs text-muted-foreground font-medium">Nominal (Rp)</label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleAmountChange}
            placeholder="24200"
            className="w-full text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-3 transition-colors"
          />
          {numericAmount > 0 && diff > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-xl">
              <p className="text-xs text-muted-foreground">
                Pembulatan ke {formatCurrency(roundedUp)} →
                <span className="text-primary font-semibold"> +{formatCurrency(userSaving)} tabungan</span>
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => numericAmount > 0 && setStep("category")}
          disabled={numericAmount <= 0}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-xl font-semibold shadow-fab disabled:opacity-40 transition-all active:scale-[0.98]"
        >
          Lanjutkan
        </button>
      </div>
    );
  }

  // scan step
  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center animate-slide-up">
      <div className="w-64 h-64 rounded-3xl border-2 border-dashed border-primary/30 flex items-center justify-center mb-8 relative bg-primary/5">
        <ScanLine className="w-16 h-16 text-primary/40" />
        <div className="absolute inset-4 border-2 border-primary/20 rounded-2xl" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">Scan QRIS</h2>
      <p className="text-sm text-muted-foreground mb-6">Arahkan kamera ke kode QR merchant</p>
      <button
        onClick={() => setStep("amount")}
        className="gradient-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-fab transition-transform active:scale-95"
      >
        Simulasi Scan Berhasil
      </button>
    </div>
  );
};

export default ScanPage;
