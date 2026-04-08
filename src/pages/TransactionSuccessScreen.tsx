import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Shield, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

interface TxData {
  merchant: string;
  category: "primer" | "sekunder";
  originalAmount: number;
  roundedAmount: number;
  saving: number;
  adminFee: number;
}

const TransactionSuccessScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tx = (location.state as TxData) || null;

  // Fallback defaults for safety
  const merchant = tx?.merchant ?? "Merchant";
  const category = tx?.category ?? "primer";
  const originalAmount = tx?.originalAmount ?? 0;
  const roundedAmount = tx?.roundedAmount ?? originalAmount;
  const saving = tx?.saving ?? 0;
  const adminFee = tx?.adminFee ?? 0;

  // Simulated quota state – in production this would come from global state
  const sekunderBudget = 750000; // 30% of 2.5M example
  const sekunderSpent = sekunderBudget - 421600; // example spent so far
  const sekunderRemaining = sekunderBudget - sekunderSpent - roundedAmount;
  const quotaPercent = Math.max(0, Math.min(100, (sekunderRemaining / sekunderBudget) * 100));

  const getZoneInfo = () => {
    if (quotaPercent > 50) return { label: "SAFE ZONE", color: "bg-success" };
    if (quotaPercent > 20) return { label: "WARNING ZONE", color: "bg-accent" };
    return { label: "DANGER ZONE", color: "bg-danger" };
  };
  const zone = getZoneInfo();

  return (
    <div className="px-5 pt-10 pb-28 max-w-md mx-auto flex flex-col items-center space-y-5 animate-slide-up">
      {/* Success Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center shadow-lg">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Transaction Complete</p>
        <h1 className="text-2xl font-bold text-foreground">Success!</h1>
      </div>

      {/* Main Transaction Card */}
      <div className="glass-card rounded-2xl p-5 w-full space-y-4">
        {/* Merchant & Category */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Paid to</p>
            <p className="text-base font-semibold text-foreground">{merchant}</p>
          </div>
          <span
            className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full uppercase ${
              category === "sekunder"
                ? "bg-accent/20 text-accent"
                : "bg-success/20 text-success"
            }`}
          >
            {category}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Final Amount */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Final Amount</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(roundedAmount)}</p>
          {saving > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Original: {formatCurrency(originalAmount)} → rounded up
            </p>
          )}
        </div>

        {/* Anti-Bocor Contribution */}
        {saving > 0 && (
          <div className="bg-success/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-semibold text-success">Anti-Bocor Contribution</p>
              <p className="text-xs text-foreground/70">
                You just saved <span className="font-bold text-success">{formatCurrency(saving)}</span> on this rounding!
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Admin fee: {formatCurrency(adminFee)} · Tabungan: {formatCurrency(saving)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Jajan Quota Card */}
      {category === "sekunder" && (
        <div className="glass-card rounded-2xl p-4 w-full space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Jajan Quota</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(Math.max(0, sekunderRemaining))}<span className="text-xs text-muted-foreground font-normal"> left</span></p>
          </div>
          <Progress value={quotaPercent} className="h-2.5" />
          <p className={`text-[10px] font-semibold uppercase tracking-wide ${
            quotaPercent > 50 ? "text-success" : quotaPercent > 20 ? "text-accent" : "text-danger"
          }`}>
            {zone.label}
          </p>
        </div>
      )}

      {/* Pro Tip Card */}
      <div className="w-full rounded-2xl p-4 space-y-2" style={{ background: "hsl(var(--foreground))" }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-primary">Pro Tip</p>
        </div>
        <p className="text-xs text-primary-foreground/70 leading-relaxed">
          Keep your 'Sekunder' spending below 20% to hit your Gold goal by December.
        </p>
      </div>

      {/* Done Button */}
      <button
        onClick={() => navigate("/")}
        className="w-full py-4 rounded-xl font-semibold text-primary-foreground shadow-fab transition-transform active:scale-[0.98]"
        style={{ background: "hsl(var(--foreground))" }}
      >
        Done
      </button>
    </div>
  );
};

export default TransactionSuccessScreen;
