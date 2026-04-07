import BalanceCard from "@/components/BalanceCard";
import AllocationBars from "@/components/AllocationBars";
import DisciplineScore from "@/components/DisciplineScore";

const allocations = [
  { label: "Kantong Primer", percentage: 50, spent: 980000, total: 1750000, variant: "primary" as const },
  { label: "Kantong Sekunder", percentage: 30, spent: 820000, total: 1050000, variant: "accent" as const },
  { label: "Dana Dingin", percentage: 20, spent: 50000, total: 700000, variant: "muted" as const },
];

const HomePage = () => {
  return (
    <div className="px-5 pt-12 pb-28 max-w-md mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Halo,</p>
          <h1 className="text-xl font-bold text-foreground">Rizky 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          R
        </div>
      </div>

      <BalanceCard balance={3500000} />

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Alokasi 50/30/20</h2>
        <AllocationBars allocations={allocations} />
      </div>

      <DisciplineScore score={72} />
    </div>
  );
};

export default HomePage;
