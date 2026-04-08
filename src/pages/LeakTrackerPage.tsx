import { AlertTriangle, Plus, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDebtHealth } from "@/contexts/DebtHealthContext";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const LeakTrackerPage = () => {
  const { debts, addDebt, removeDebt, income, totalDebt, totalInterest, ratio, status, isEmergency } = useDebtHealth();
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrincipal, setFormPrincipal] = useState("");
  const [formRate, setFormRate] = useState("");
  const [formTenor, setFormTenor] = useState("3");
  const [formDueDay, setFormDueDay] = useState("25");

  const getStatusDisplay = () => {
    if (status === "aman") return { label: "AMAN", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
    if (status === "waspada") return { label: "WASPADA", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
    return { label: "BAHAYA", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" };
  };

  const statusDisplay = getStatusDisplay();
  const ayamGeprek = Math.round(totalInterest / 15000);

  const handleAdd = () => {
    if (!formName || !formPrincipal) return;
    addDebt({
      name: formName,
      principal: parseInt(formPrincipal) || 0,
      interestRate: parseFloat(formRate) || 0,
      tenor: parseInt(formTenor) || 3,
      dueDate: formDueDay,
    });
    setFormName("");
    setFormPrincipal("");
    setFormRate("");
    setFormTenor("3");
    setFormDueDay("25");
    setShowAdd(false);
  };

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <h1 className="text-xl font-bold text-foreground">Leak Tracker</h1>
      <p className="text-sm text-muted-foreground -mt-3">Awasi kebocoran keuanganmu.</p>

      {/* Emergency banner */}
      {isEmergency && (
        <div className="gradient-danger rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <AlertCircle className="w-6 h-6 text-danger-foreground flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-danger-foreground">🚨 Mode Darurat Aktif!</p>
            <p className="text-xs text-danger-foreground/80">Hutangmu sudah di zona bahaya. Transaksi Sekunder dibatasi max Rp50.000.</p>
          </div>
        </div>
      )}

      {/* Debt Health */}
      <div className={`glass-card rounded-xl p-5 border ${statusDisplay.border} animate-slide-up`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Debt Health</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusDisplay.bg} ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-4xl font-bold ${statusDisplay.color}`}>{ratio}%</span>
          <span className="text-sm text-muted-foreground pb-1">dari pendapatan ({formatCurrency(income)})</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${status === "bahaya" ? "gradient-danger" : status === "waspada" ? "gradient-accent" : "gradient-primary"}`}
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
            <p className="text-xs text-muted-foreground mt-0.5">
              ({formatCurrency(totalInterest)} ÷ Rp15.000/porsi)
            </p>
          </div>
        </div>
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Daftar Cicilan</h2>
          <button onClick={() => setShowAdd(true)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
              <p className="text-xs text-muted-foreground">Jatuh tempo: Tgl {d.dueDate}</p>
              <p className="text-xs text-muted-foreground">Sisa tenor: {d.remainingTenor} bulan</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{formatCurrency(d.amount)}</p>
                <p className="text-xs text-danger">+{formatCurrency(d.interest)} bunga</p>
              </div>
              <button onClick={() => removeDebt(d.id)} className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5 text-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Debt Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Tambah Cicilan</DialogTitle>
            <DialogDescription>Masukkan detail hutang/PayLater kamu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nama Cicilan/Platform</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Shopee PayLater" className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Total Pinjaman Pokok</label>
              <input type="number" value={formPrincipal} onChange={(e) => setFormPrincipal(e.target.value)} placeholder="500000" className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Bunga per Bulan (%)</label>
              <input type="number" step="0.1" value={formRate} onChange={(e) => setFormRate(e.target.value)} placeholder="2.5" className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Tenor (Bulan)</label>
                <select value={formTenor} onChange={(e) => setFormTenor(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} bulan</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Tgl Jatuh Tempo</label>
                <input type="number" min={1} max={31} value={formDueDay} onChange={(e) => setFormDueDay(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <button onClick={handleAdd} disabled={!formName || !formPrincipal} className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-fab disabled:opacity-40 transition-all active:scale-[0.98]">
              Simpan Cicilan
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeakTrackerPage;
