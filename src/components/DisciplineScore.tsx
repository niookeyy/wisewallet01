interface DisciplineScoreProps {
  score: number; // 0-100
}

const DisciplineScore = ({ score }: DisciplineScoreProps) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-danger";
  };

  const getStroke = () => {
    if (score >= 70) return "hsl(152, 60%, 42%)";
    if (score >= 40) return "hsl(30, 95%, 55%)";
    return "hsl(0, 72%, 51%)";
  };

  return (
    <div className="glass-card rounded-xl p-5 flex items-center gap-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
          <circle
            cx="50" cy="50" r="45"
            stroke={getStroke()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${getColor()}`}>{score}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Skor Disiplin</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {score >= 70 ? "Keuanganmu terkendali. Pertahankan!" :
           score >= 40 ? "Hati-hati, pengeluaranmu mulai membengkak." :
           "Peringatan! Kamu butuh rem darurat sekarang."}
        </p>
      </div>
    </div>
  );
};

export default DisciplineScore;
