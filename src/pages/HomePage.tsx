import BalanceCard from "@/components/BalanceCard";
import AllocationBars from "@/components/AllocationBars";
import DisciplineScore from "@/components/DisciplineScore";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { profile, user } = useAuth();

  const name =
    profile?.name || profile?.username || user?.email?.split("@")[0] || "Pengguna";
  const primer = profile?.balance_primer ?? 0;
  const sekunder = profile?.balance_sekunder ?? 0;
  const coldFund = profile?.balance_cold_fund ?? 0;
  const total = primer + sekunder + coldFund;
  const totalIncome = profile?.total_income ?? 0;

  const allocations = [
    {
      label: "Kantong Primer",
      percentage: total ? Math.round((primer / total) * 100) : 0,
      amount: primer,
      variant: "primary" as const,
    },
    {
      label: "Kantong Sekunder",
      percentage: total ? Math.round((sekunder / total) * 100) : 0,
      amount: sekunder,
      variant: "accent" as const,
    },
    {
      label: "Dana Dingin",
      percentage: total ? Math.round((coldFund / total) * 100) : 0,
      amount: coldFund,
      variant: "muted" as const,
    },
  ];

  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Halo,</p>
          <h1 className="text-xl font-bold text-foreground">{name} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pendapatan bulanan: Rp {new Intl.NumberFormat("id-ID").format(totalIncome)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <BalanceCard balance={total} />

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Alokasi Saldo</h2>
        <AllocationBars allocations={allocations} />
      </div>

      <DisciplineScore score={72} />
    </div>
  );
};

export default HomePage;
