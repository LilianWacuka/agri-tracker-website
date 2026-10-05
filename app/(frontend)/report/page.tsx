"use client";
import { useEffect, useState } from "react";
import IncomePieChart from "@/components/reports/incomePieChart";
import ExpensePieChart from "@/components/reports/expensePieChart";
import IncomeExpenseChart from"@/components/reports/incomeexpenseBarChart";
import ProfitLossChart from "@/components/reports/profitlossChart";
import ReportSummary from "@/components/reports/reportSummary";
interface ReportData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    profitLoss: number;
  };

  incomeByCategory: {
    category: string;
    total: number;
  }[];

  expenseByCategory: {
    category: string;
    total: number;
  }[];

  monthly: {
    month: string;
    income: number;
    expenses: number;
    profitLoss: number;
  }[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {console.error("User ID not found");
          return;
        }

        const response = await fetch(`/api/report?userId=${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json(); 
        setReport(data);
      } catch (error) {
        console.error("Report error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading reports...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <p>Unable to load reports.</p>
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold">
          Reports
        </h1>

        <p className="text-muted-foreground">
          View your income, expenses and business performance.
        </p>
      </div>

      {/* summary */}
        <ReportSummary
        totalIncome={report.summary.totalIncome}
        totalExpenses={report.summary.totalExpenses}
        profitLoss={report.summary.profitLoss}
      />

      {/* Charts Displayed here */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Income Distribution by Category
          </h2>

          <div className="width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1">
            {report.incomeByCategory.length > 0 ? (
              <IncomePieChart data={report.incomeByCategory}
              />
            ):(
              <p className="text-muted-foreground">
                No income data available for the selected period.
              </p>
            )
            }
          </div>
        </div>  

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Expense Summary
          </h2>

          <div className="width: '100%', maxwidth: '500px', maxHeight: '80vh', aspectRatio: 1">
            {report.expenseByCategory.length > 0 ?(
              <ExpensePieChart data={report.expenseByCategory}
              />
            ):(
              <p className="text-muted-foreground">
              No expense data available for the selected period.
            </p>
            )}
            
          </div>
        </div>

      </section>

      {/* Income vs Expenses */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Income vs Expenses
        </h2>

        <div className="flex h-80 items-center justify-center">
          {report.monthly.length > 0 ?(
            <IncomeExpenseChart data = {report.monthly}/>
          ): (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">
                No transactions data
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Profit and Loss */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Profit & Loss Trend
        </h2>
        {report.monthly.length > 0 ?(
          <ProfitLossChart data= {report.monthly}
          />
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">
              No transaction data available.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
