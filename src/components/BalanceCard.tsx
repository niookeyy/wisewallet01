import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const [visible, setVisible] = useState(true);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="gradient-dark rounded-2xl p-6 text-primary-foreground shadow-elevated animate-slide-up">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm opacity-70 font-medium">Total Saldo Aktif</span>
        <button onClick={() => setVisible(!visible)} className="opacity-70 hover:opacity-100 transition-opacity">
          {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-3xl font-bold tracking-tight mb-4">
        {visible ? formatCurrency(balance) : "Rp ••••••••"}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/30 text-primary-foreground font-medium">
          Wise Wallet
        </span>
        <span className="text-xs opacity-60">•••• 8842</span>
      </div>
    </div>
  );
};

export default BalanceCard;
