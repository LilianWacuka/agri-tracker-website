"use client";

interface ReportSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  profitLoss: number;
}

export default function ReportSummary({
  totalIncome,
  totalExpenses,
  profitLoss,
}: ReportSummaryProps) {
  const isProfit = profitLoss >= 0;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Income */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Total Income
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          KSh {totalIncome.toLocaleString()}
        </h2>
      </div>

      {/* Total Expenses */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Total Expenses
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          KSh {totalExpenses.toLocaleString()}
        </h2>
      </div>

      {/* Profit / Loss */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {isProfit ? "Profit" : "Loss"}
        </p>

        <h2
          className={`mt-2 text-2xl font-bold ${
            isProfit ? "text-green-600" : "text-red-600"
          }`}
        >
          KSh {Math.abs(profitLoss).toLocaleString()}
        </h2>
      </div>
    </section>
  );
}
