import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timer, Zap, Hourglass, CheckCircle, XCircle } from "lucide-react";
import { usePendingTransactions } from "@/contexts/PendingTransactionsContext";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const CoolingPeriodScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pending, completePending, cancelPending } = usePendingTransactions();
  const tx = pending.find((t) => t.id === id);

  const [now, setNow] = useState(Date.now());
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = tx ? Math.max(0, tx.expiresAt - now) : 0;
  const totalDuration = tx ? tx.expiresAt - tx.createdAt : 86400000;
  const progress = tx ? 1 - remaining / totalDuration : 0;
  const isExpired = remaining <= 0 && tx?.status === "pending";

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // SVG circle params
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleBypass = useCallback(() => {
    if (tx) {
      completePending(tx.id);
      navigate("/transaction-success", {
        state: {
          merchant: tx.source || "Merchant",
          category: "sekunder",
          originalAmount: tx.amount,
          roundedAmount: tx.roundedAmount,
          saving: tx.saving,
          adminFee: tx.adminFee,
        },
      });
    }
  }, [tx, completePending, navigate]);

  const handleWait = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleExecute = useCallback(() => {
    if (tx) {
      completePending(tx.id);
      navigate("/transaction-success", {
        state: {
          merchant: tx.source || "Merchant",
          category: "sekunder",
          originalAmount: tx.amount,
          roundedAmount: tx.roundedAmount,
          saving: tx.saving,
          adminFee: tx.adminFee,
        },
      });
    }
  }, [tx, completePending, navigate]);

  const handleCancel = useCallback(() => {
    if (tx) {
      cancelPending(tx.id);
      navigate("/");
    }
  }, [tx, cancelPending, navigate]);

  if (!tx) {
    return (
      <div className="px-5 pt-20 pb-28 max-w-md mx-auto text-center">
        <p className="text-muted-foreground">Transaksi tidak ditemukan.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary font-semibold">Kembali</button>
      </div>
    );
  }

  // Timer expired → show completion prompt
  if (isExpired || showComplete) {
    return (
      <div className="px-5 pt-12 pb-28 max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-slide-up">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
          <Timer className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Masa Tunggu Selesai!</h2>
          <p className="text-sm text-muted-foreground">
            Apakah kamu masih ingin melanjutkan pembelian sebesar {formatCurrency(tx.amount)}?
          </p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleExecute}
            className="w-full gradient-primary text-primary-foreground py-4 rounded-xl font-semibold shadow-fab flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <CheckCircle className="w-5 h-5" />
            Ya, Eksekusi Sekarang
          </button>
          <button
            onClick={handleCancel}
            className="w-full glass-card border border-border py-4 rounded-xl font-semibold text-foreground flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <XCircle className="w-5 h-5" />
            Batalkan (Uang Kembali)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-10 pb-28 max-w-md mx-auto flex flex-col items-center space-y-6 animate-slide-up">
      {/* Badge */}
      <div className="bg-muted px-4 py-1.5 rounded-full">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">SEKUNDER MODE ACTIVE</span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">Tunggu Sebentar!</h1>
        <p className="text-sm text-muted-foreground mt-1">Mari berpikir jernih.</p>
      </div>

      {/* Circular countdown */}
      <div className="relative flex items-center justify-center my-4">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground tracking-tight">{timeStr}</span>
          <span className="text-xs text-muted-foreground mt-1">tersisa</span>
        </div>
      </div>

      {/* Info box */}
      <div className="glass-card rounded-xl p-4 w-full">
        <p className="text-sm text-foreground leading-relaxed">
          💡 Riset bilang <span className="font-semibold text-accent">45% belanja itu cuma impulsif</span>. Dana ini akan tertahan 24 jam untuk melindungimu dari penyesalan.
        </p>
      </div>

      {/* Transaction detail */}
      <div className="glass-card rounded-xl p-4 w-full flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Nominal tertahan</span>
        <span className="text-lg font-bold text-foreground">{formatCurrency(tx.roundedAmount)}</span>
      </div>

      {/* Action buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={handleBypass}
          className="w-full rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{ background: "hsl(var(--foreground))" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-primary-foreground">Bypass Fast Track</p>
              <p className="text-xs text-primary-foreground/60">(Emergency Only)</p>
            </div>
          </div>
          <span className="text-sm font-bold text-accent">{formatCurrency(500)}</span>
        </button>

        <button
          onClick={handleWait}
          className="w-full glass-card border border-border rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Hourglass className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Sabar Menunggu</p>
            <p className="text-xs text-muted-foreground">Kembali ke Dashboard, transaksi tetap berjalan.</p>
          </div>
        </button>
      </div>

      {/* Quote */}
      <p className="text-xs text-muted-foreground italic text-center px-4 pt-2">
        "Disiplin finansial bukan tentang menahan diri, tapi tentang memberi kebebasan pada dirimu di masa depan."
      </p>
    </div>
  );
};

export default CoolingPeriodScreen;
