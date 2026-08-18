"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  total: number;
};

type ChartItem = {
  category: string;
  total: number;
};

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#0ea5e9",
];

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/transaction?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  // Group income transactions by category and add their totals.
  const incomeByCategory = useMemo<ChartItem[]>(() => {
    const groupedIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce<Record<string, number>>((result, transaction) => {
        const category = transaction.category || "Uncategorized";

        result[category] =
          (result[category] ?? 0) + Number(transaction.total);

        return result;
      }, {});

    return Object.entries(groupedIncome).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  //group expense transactions by category and add their totals.
   const expenseByCategory = useMemo<ChartItem[]>(() => {
    const groupedExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Record<string, number>>((result, transaction) => {
        const category = transaction.category || "Uncategorized";

        result[category] =
          (result[category] ?? 0) + Number(transaction.total);

        return result;
      }, {});

    return Object.entries(groupedExpense).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  // Return JSX on the same line as return.
  if (loading) {
    return (
      <div>
        <p className="p-10 text-center">Loading Reports...</p>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-10">
        <div className="p-4 mt-6 bg-#4B3D23">
            <h1 className="text-2xl font-bold text-center text-[#4B3D23]">
                Reports coming soon...
            </h1>
        </div>
      {/* Reports Content */}
    </main>
  );
}