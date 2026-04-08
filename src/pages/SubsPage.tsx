import { useState, useEffect } from "react";
import { Calendar, Pause, CheckCircle, Plus, X, Trash2, Clock, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePendingTransactions } from "@/contexts/PendingTransactionsContext";
import { useNavigate } from "react-router-dom";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  dueDay: number;
  category: "hiburan" | "produktivitas";
  icon: string;
  status: "active" | "delayed" | "paid";
}

const defaultSubs: Subscription[] = [
  { id: "1", name: "Netflix", price: 186000, dueDay: 15, category: "hiburan", icon: "🎬", status: "delayed" },
  { id: "2", name: "Spotify", price: 54990, dueDay: 20, category: "hiburan", icon: "🎵", status: "delayed" },
  { id: "3", name: "Disney+", price: 159000, dueDay: 1, category: "hiburan", icon: "✨", status: "delayed" },
  { id: "4", name: "ChatGPT Plus", price: 320000, dueDay: 10, category: "produktivitas", icon: "🤖", status: "active" },
  { id: "5", name: "Notion", price: 128000, dueDay: 12, category: "produktivitas", icon: "📝", status: "active" },
  { id: "6", name: "iCloud 200GB", price: 45000, dueDay: 5, category: "produktivitas", icon: "☁️", status: "active" },
];

const popularServices = [
  { name: "Netflix", icon: "🎬" },
  { name: "Spotify", icon: "🎵" },
  { name: "Disney+", icon: "✨" },
  { name: "YouTube Premium", icon: "▶️" },
  { name: "ChatGPT Plus", icon: "🤖" },
  { name: "Notion", icon: "📝" },
  { name: "iCloud", icon: "☁️" },
  { name: "LinkedIn Premium", icon: "💼" },
  { name: "PlayStation Plus", icon: "🎮" },
  { name: "Google One", icon: "🔵" },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const SubsPage = () => {
  const navigate = useNavigate();
  const { addPending } = usePendingTransactions();
  const [subs, setSubs] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("ww_subs");
    return saved ? JSON.parse(saved) : defaultSubs;
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showDelay, setShowDelay] = useState<Subscription | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("📦");
  const [formPrice, setFormPrice] = useState("");
  const [formDueDay, setFormDueDay] = useState("1");
  const [formCategory, setFormCategory] = useState<"hiburan" | "produktivitas">("hiburan");

  useEffect(() => { localStorage.setItem("ww_subs", JSON.stringify(subs)); }, [subs]);

  const hiburan = subs.filter((s) => s.category === "hiburan");
  const produktivitas = subs.filter((s) => s.category === "produktivitas");
  const totalMonthly = subs.reduce((s, sub) => s + sub.price, 0);

  const today = new Date().getDate();

  const getStatusLabel = (sub: Subscription) => {
    if (sub.category === "produktivitas") return { text: "Auto-Paid", color: "text-primary bg-primary/10" };
    if (sub.status === "paid") return { text: "Dibayar", color: "text-primary bg-primary/10" };
    if (sub.status === "delayed") return { text: "Delayed", color: "text-accent bg-accent/10" };
    if (sub.dueDay === today + 1) return { text: "Jatuh Tempo Besok", color: "text-danger bg-danger/10" };
    return { text: "Menunggu Jeda", color: "text-accent bg-accent/10" };
  };

  const handleAddSub = () => {
    if (!formName || !formPrice) return;
    const newSub: Subscription = {
      id: Date.now().toString(),
      name: formName,
      price: parseInt(formPrice) || 0,
      dueDay: parseInt(formDueDay) || 1,
      category: formCategory,
      icon: formIcon,
      status: formCategory === "produktivitas" ? "active" : "delayed",
    };
    setSubs((prev) => [...prev, newSub]);
    resetForm();
    setShowAdd(false);
  };

  const removeSub = (id: string) => setSubs((prev) => prev.filter((s) => s.id !== id));

  const resetForm = () => {
    setFormName("");
    setFormIcon("📦");
    setFormPrice("");
    setFormDueDay("1");
    setFormCategory("hiburan");
  };

  const handleSelectService = (s: { name: string; icon: string }) => {
    setFormName(s.name);
    setFormIcon(s.icon);
  };

  const handleFastTrack = (sub: Subscription) => {
    setSubs((prev) => prev.map((s) => s.id === sub.id ? { ...s, status: "paid" } : s));
    setShowDelay(null);
  };

  const handleDelay24h = (sub: Subscription) => {
    const now = Date.now();
    const txId = addPending({
      amount: sub.price,
      roundedAmount: sub.price,
      saving: 0,
      adminFee: 0,
      category: "sekunder",
      createdAt: now,
      expiresAt: now + 86400000,
      source: sub.name,
    });
    setShowDelay(null);
    navigate(`/cooling/${txId}`);
  };

  const renderSubCard = (s: Subscription, i: number) => {
    const statusLabel = getStatusLabel(s);
    return (
      <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{s.icon}</span>
          <div>
            <p className="text-sm font-semibold text-foreground">{s.name}</p>
            <p className="text-xs text-muted-foreground">Jatuh tempo: Tgl {s.dueDay}</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <div>
            <p className="text-sm font-bold text-foreground">{formatCurrency(s.price)}</p>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusLabel.color}`}>{statusLabel.text}</span>
          </div>
          <div className="flex flex-col gap-1">
            {s.category === "hiburan" && s.status === "delayed" && (
              <button onClick={() => setShowDelay(s)} className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-3 h-3 text-accent" />
              </button>
            )}
            <button onClick={() => removeSub(s.id)} className="w-6 h-6 rounded-full bg-danger/10 flex items-center justify-center">
              <Trash2 className="w-3 h-3 text-danger" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <h1 className="text-xl font-bold text-foreground">Invisible Subs</h1>
      <p className="text-sm text-muted-foreground -mt-3">Langganan yang diam-diam menguras saldo.</p>

      {/* Total */}
      <div className="glass-card rounded-xl p-5 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total kebocoran rutin/bulan</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalMonthly)}</p>
          </div>
        </div>
      </div>

      {/* Hiburan */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Pause className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Hiburan (Delayed)</h2>
        </div>
        {hiburan.map((s, i) => renderSubCard(s, i))}
      </div>

      {/* Produktivitas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Produktivitas (Auto-Paid)</h2>
        </div>
        {produktivitas.map((s, i) => renderSubCard(s, i))}
      </div>

      {/* Add button */}
      <button
        onClick={() => { resetForm(); setShowAdd(true); }}
        className="w-full glass-card rounded-xl p-4 flex items-center justify-center gap-2 text-primary font-semibold transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" /> Tambah Langganan Baru
      </button>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Tambah Langganan</DialogTitle>
            <DialogDescription>Masukkan detail langganan digital kamu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Popular picker */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Pilih layanan populer</label>
              <div className="flex flex-wrap gap-2">
                {popularServices.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSelectService(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${formName === s.name ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Nama Layanan</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama layanan" className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nominal Tagihan</label>
              <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="186000" className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tanggal Jatuh Tempo (1-31)</label>
              <input type="number" min={1} max={31} value={formDueDay} onChange={(e) => setFormDueDay(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Kategori</label>
              <div className="flex gap-3">
                <button onClick={() => setFormCategory("produktivitas")} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${formCategory === "produktivitas" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  Produktivitas
                </button>
                <button onClick={() => setFormCategory("hiburan")} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${formCategory === "hiburan" ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  Hiburan
                </button>
              </div>
            </div>
            <button onClick={handleAddSub} disabled={!formName || !formPrice} className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-fab disabled:opacity-40 transition-all active:scale-[0.98]">
              Simpan Langganan
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delay Dialog for Hiburan subs */}
      <Dialog open={!!showDelay} onOpenChange={() => setShowDelay(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Tagihan Terdeteksi</DialogTitle>
            <DialogDescription>
              Tagihan {showDelay?.name} sebesar {showDelay ? formatCurrency(showDelay.price) : ""} terdeteksi. Sistem menahan pembayaran 24 jam karena ini kategori Sekunder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <button onClick={() => showDelay && handleFastTrack(showDelay)} className="w-full rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]" style={{ background: "hsl(var(--foreground))" }}>
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-primary-foreground">Fast Track</p>
                <p className="text-xs text-primary-foreground/60">Bayar penalti dari Dana Dingin</p>
              </div>
              <span className="text-sm font-bold text-accent">{formatCurrency(500)}</span>
            </button>
            <button onClick={() => showDelay && handleDelay24h(showDelay)} className="w-full glass-card border border-border rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Tunda 24 Jam</p>
                <p className="text-xs text-muted-foreground">Biarkan emosi belanja mendingin.</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubsPage;
