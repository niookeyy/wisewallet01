import { Home, TrendingDown, CreditCard, PiggyBank, ScanLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/leak-tracker", icon: TrendingDown, label: "Hutang" },
  { path: "/scan", icon: ScanLine, label: "SCAN", isFab: true },
  { path: "/subs", icon: CreditCard, label: "Langganan" },
  { path: "/savings", icon: PiggyBank, label: "Tabungan" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="max-w-md mx-auto flex items-end justify-around px-2 pt-1 pb-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          if (tab.isFab) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -top-5 w-16 h-16 rounded-full gradient-primary shadow-fab flex items-center justify-center animate-pulse-glow transition-transform active:scale-95"
              >
                <tab.icon className="w-7 h-7 text-primary-foreground" />
              </button>
            );
          }
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-all ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
