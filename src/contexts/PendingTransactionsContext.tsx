import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PendingTransaction {
  id: string;
  amount: number;
  roundedAmount: number;
  saving: number;
  adminFee: number;
  category: "sekunder";
  createdAt: number; // timestamp
  expiresAt: number; // timestamp (createdAt + 24h)
  source?: string;
  status: "pending" | "completed" | "cancelled";
}

interface PendingTransactionsContextType {
  pending: PendingTransaction[];
  addPending: (tx: Omit<PendingTransaction, "id" | "status">) => string;
  completePending: (id: string) => void;
  cancelPending: (id: string) => void;
  getActivePending: () => PendingTransaction[];
}

const PendingTransactionsContext = createContext<PendingTransactionsContextType | null>(null);

export const usePendingTransactions = () => {
  const ctx = useContext(PendingTransactionsContext);
  if (!ctx) throw new Error("usePendingTransactions must be used within PendingTransactionsProvider");
  return ctx;
};

export const PendingTransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingTransaction[]>(() => {
    const saved = localStorage.getItem("ww_pending_tx");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem("ww_pending_tx", JSON.stringify(pending)); }, [pending]);

  const addPending = (tx: Omit<PendingTransaction, "id" | "status">) => {
    const id = Date.now().toString();
    setPending((prev) => [...prev, { ...tx, id, status: "pending" }]);
    return id;
  };

  const completePending = (id: string) =>
    setPending((prev) => prev.map((t) => t.id === id ? { ...t, status: "completed" } : t));

  const cancelPending = (id: string) =>
    setPending((prev) => prev.map((t) => t.id === id ? { ...t, status: "cancelled" } : t));

  const getActivePending = () => pending.filter((t) => t.status === "pending");

  return (
    <PendingTransactionsContext.Provider value={{ pending, addPending, completePending, cancelPending, getActivePending }}>
      {children}
    </PendingTransactionsContext.Provider>
  );
};
