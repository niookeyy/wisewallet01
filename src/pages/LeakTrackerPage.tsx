import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";

interface Debt {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  interest: number;
}

const initialDebts: Debt[] = [
  { id: "1", name: "Shopee PayLater", amount: 450000, dueDate: "25 Apr", interest: 12500 },
  { id: "2", name: "Traveloka PayLater", amount: 680000, dueDate: "1 Mei", interest: 18700 },
  { id: "3", name: "GoPay Later", amount: 220000, dueDate: "15 Apr", interest: 6200 },
];

const LeakTrackerPage = () => {
  const [debts] = useState<Debt[]>(initialDebts);
  const income = 3500000;
  const totalDebt = debts.reduce((s, d) => s + d.amount, 0);
  const totalInterest = debts.reduce((s, d) => s + d.interest, 0);
  const ratio = Math.round((totalDebt / income) * 100);

  const getStatus = () => {
    if (ratio <= 20) return { label: "AMAN", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
    if (ratio <= 30) return { label: "WASPADA", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" };
    return { label: "BAHAYA", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" };
  };

  const status = getStatus();
  const ayamGeprek = Math.round(totalInterest / 15000);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <h1 className="text-xl font-bold text-foreground">Leak Tracker</h1>
      <p className="text-sm text-muted-foreground -mt-3">Awasi kebocoran keuanganmu.</p>

      {/* Debt Health */}
      <div className={`glass-card rounded-xl p-5 border ${status.border} animate-slide-up`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Debt Health</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-4xl font-bold ${status.color}`}>{ratio}%</span>
          <span className="text-sm text-muted-foreground pb-1">dari pendapatan</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${ratio > 30 ? "gradient-danger" : ratio > 20 ? "gradient-accent" : "gradient-primary"}`}
            style={{ width: `${Math.min(ratio, 100)}%` }}
          />
        </div>
      </div>

      {/* Leak Meter Analogy */}
      <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Bunga cicilan bulan ini</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalInterest)} = <span className="font-bold text-accent">{ayamGeprek} porsi Ayam Geprek</span>
            </p>
          </div>
        </div>
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Daftar Cicilan</h2>
          <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {debts.map((d, i) => (
          <div
            key={d.id}
            className="glass-card rounded-xl p-4 flex items-center justify-between animate-slide-up"
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{d.name}</p>
              <p className="text-xs text-muted-foreground">Jatuh tempo: {d.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{formatCurrency(d.amount)}</p>
              <p className="text-xs text-danger">+{formatCurrency(d.interest)} bunga</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeakTrackerPage;
