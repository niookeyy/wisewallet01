import { Lock, Unlock, TrendingUp } from "lucide-react";

const savingsHistory = [
  { id: "1", source: "Kopi Kenangan", amount: 450, date: "Hari ini" },
  { id: "2", source: "GoFood Ayam", amount: 270, date: "Hari ini" },
  { id: "3", source: "Indomaret", amount: 180, date: "Kemarin" },
  { id: "4", source: "Starbucks", amount: 360, date: "Kemarin" },
  { id: "5", source: "GrabFood", amount: 90, date: "2 hari lalu" },
  { id: "6", source: "McDonald's", amount: 270, date: "3 hari lalu" },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const SavingsPage = () => {
  const totalSaved = 78450;
  const target = 100000;
  const progress = Math.min((totalSaved / target) * 100, 100);
  const canWithdraw = totalSaved >= target;

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <h1 className="text-xl font-bold text-foreground">Tabungan Anti-Bocor</h1>
      <p className="text-sm text-muted-foreground -mt-3">Hasil kedisiplinanmu ada di sini.</p>

      {/* Total */}
      <div className="gradient-dark rounded-2xl p-6 text-primary-foreground animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 opacity-70" />
          <span className="text-sm opacity-70">Total Saldo Anti-Bocor</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalSaved)}</p>
        <p className="text-xs opacity-60 mt-1">Diinvestasikan di Reksa Dana Pasar Uang</p>
      </div>

      {/* Lock Progress */}
      <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {canWithdraw ? (
              <Unlock className="w-5 h-5 text-primary" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
            <h3 className="text-sm font-semibold text-foreground">The Lock Mechanism</h3>
          </div>
          <span className="text-xs text-muted-foreground">{formatCurrency(totalSaved)} / {formatCurrency(target)}</span>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          disabled={!canWithdraw}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
            canWithdraw
              ? "gradient-primary text-primary-foreground shadow-fab"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {canWithdraw ? "Tarik Dana ke Bank Utama" : `Kumpulkan ${formatCurrency(target - totalSaved)} lagi`}
        </button>

        {!canWithdraw && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Tabunganmu belum cukup kuat untuk ditarik. Terus belanja bijak!
          </p>
        )}
      </div>

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Riwayat Menabung</h2>
        {savingsHistory.map((h, i) => (
          <div
            key={h.id}
            className="glass-card rounded-xl p-4 flex items-center justify-between animate-slide-up"
            style={{ animationDelay: `${0.15 + i * 0.03}s` }}
          >
            <div>
              <p className="text-sm font-medium text-foreground">Hemat dari {h.source}</p>
              <p className="text-xs text-muted-foreground">{h.date}</p>
            </div>
            <span className="text-sm font-bold text-primary">+{formatCurrency(h.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsPage;
