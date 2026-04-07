interface Allocation {
  label: string;
  percentage: number;
  spent: number;
  total: number;
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
      {allocations.map((a) => {
        const pct = Math.min((a.spent / a.total) * 100, 100);
        return (
          <div key={a.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-semibold text-foreground">{a.label}</span>
                <span className="text-xs text-muted-foreground ml-2">({a.percentage}%)</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(a.total - a.spent)} <span className="text-muted-foreground text-xs">sisa</span>
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[a.variant]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(a.spent)} dari {formatCurrency(a.total)} terpakai
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AllocationBars;
