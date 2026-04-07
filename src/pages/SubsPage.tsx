import { Calendar, Pause, CheckCircle } from "lucide-react";

interface Sub {
  id: string;
  name: string;
  price: number;
  dueDate: string;
  category: "hiburan" | "produktivitas";
  icon: string;
}

const subs: Sub[] = [
  { id: "1", name: "Netflix", price: 186000, dueDate: "15 Apr", category: "hiburan", icon: "🎬" },
  { id: "2", name: "Spotify", price: 54990, dueDate: "20 Apr", category: "hiburan", icon: "🎵" },
  { id: "3", name: "Disney+", price: 159000, dueDate: "1 Mei", category: "hiburan", icon: "✨" },
  { id: "4", name: "ChatGPT Plus", price: 320000, dueDate: "10 Apr", category: "produktivitas", icon: "🤖" },
  { id: "5", name: "Notion", price: 128000, dueDate: "12 Apr", category: "produktivitas", icon: "📝" },
  { id: "6", name: "iCloud 200GB", price: 45000, dueDate: "5 Mei", category: "produktivitas", icon: "☁️" },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const SubsPage = () => {
  const hiburan = subs.filter((s) => s.category === "hiburan");
  const produktivitas = subs.filter((s) => s.category === "produktivitas");
  const totalMonthly = subs.reduce((s, sub) => s + sub.price, 0);

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <h1 className="text-xl font-bold text-foreground">Invisible Subs</h1>
      <p className="text-sm text-muted-foreground -mt-3">Langganan yang diam-diam menguras saldo.</p>

      <div className="glass-card rounded-xl p-5 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total pengeluaran rutin/bulan</p>
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
        {hiburan.map((s, i) => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">Jatuh tempo: {s.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{formatCurrency(s.price)}</p>
              <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Delayed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Produktivitas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Produktivitas (Auto-Paid)</h2>
        </div>
        {produktivitas.map((s, i) => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">Jatuh tempo: {s.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{formatCurrency(s.price)}</p>
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Auto-Paid</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubsPage;
