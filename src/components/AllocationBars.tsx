interface Allocation {
  label: string;
  percentage: number;
  amount: number;
  variant: "primary" | "accent" | "muted";
}

const AllocationBars = ({ allocations }: { allocations: Allocation[] }) => {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const barColors: Record<string, string> = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    muted: "bg-muted-foreground/30",
  };

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      {allocations.map((a) => (
        <div key={a.label} className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-foreground">{a.label}</span>
              <span className="text-xs text-muted-foreground ml-2">({a.percentage}%)</span>
            </div>
            <span className="text-sm font-medium text-foreground">{formatCurrency(a.amount)}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[a.variant]}`}
              style={{ width: `${a.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {a.percentage}% dari total saldo
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllocationBars;
