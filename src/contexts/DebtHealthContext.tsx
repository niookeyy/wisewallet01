import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Debt {
  id: string;
  name: string;
  amount: number;
  principal: number;
  interestRate: number;
  tenor: number;
  remainingTenor: number;
  dueDate: string;
  interest: number;
}

interface DebtHealthContextType {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "interest" | "amount" | "remainingTenor">) => void;
  removeDebt: (id: string) => void;
  income: number;
  setIncome: (n: number) => void;
  totalDebt: number;
  totalInterest: number;
  ratio: number;
  status: "aman" | "waspada" | "bahaya";
  isEmergency: boolean;
}

const DebtHealthContext = createContext<DebtHealthContextType | null>(null);

export const useDebtHealth = () => {
  const ctx = useContext(DebtHealthContext);
  if (!ctx) throw new Error("useDebtHealth must be used within DebtHealthProvider");
  return ctx;
};

export const DebtHealthProvider = ({ children }: { children: ReactNode }) => {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem("ww_debts");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Shopee PayLater", principal: 450000, amount: 450000, interestRate: 2.5, tenor: 3, remainingTenor: 2, dueDate: "25", interest: 12500 },
      { id: "2", name: "Traveloka PayLater", principal: 680000, amount: 680000, interestRate: 2.75, tenor: 6, remainingTenor: 4, dueDate: "1", interest: 18700 },
      { id: "3", name: "GoPay Later", principal: 220000, amount: 220000, interestRate: 2.8, tenor: 3, remainingTenor: 1, dueDate: "15", interest: 6200 },
    ];
  });

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("ww_income");
    return saved ? Number(saved) : 3500000;
  });

  useEffect(() => { localStorage.setItem("ww_debts", JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem("ww_income", String(income)); }, [income]);

  const addDebt = (d: Omit<Debt, "id" | "interest" | "amount" | "remainingTenor">) => {
    const interest = Math.round(d.principal * (d.interestRate / 100));
    const monthlyPayment = Math.round(d.principal / d.tenor) + interest;
    const newDebt: Debt = {
      ...d,
      id: Date.now().toString(),
      interest,
      amount: monthlyPayment,
      remainingTenor: d.tenor,
    };
    setDebts((prev) => [...prev, newDebt]);
  };

  const removeDebt = (id: string) => setDebts((prev) => prev.filter((d) => d.id !== id));

  const totalDebt = debts.reduce((s, d) => s + d.amount, 0);
  const totalInterest = debts.reduce((s, d) => s + d.interest, 0);
  const ratio = income > 0 ? Math.round((totalDebt / income) * 100) : 0;
  const status = ratio <= 20 ? "aman" : ratio <= 30 ? "waspada" : "bahaya";
  const isEmergency = ratio > 30;

  return (
    <DebtHealthContext.Provider value={{ debts, addDebt, removeDebt, income, setIncome, totalDebt, totalInterest, ratio, status, isEmergency }}>
      {children}
    </DebtHealthContext.Provider>
  );
};
