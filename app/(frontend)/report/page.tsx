"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import IncomePieChart from "@/components/reports/incomePieChart";
import ExpensePieChart from "@/components/reports/expensePieChart";
import IncomeExpenseChart from "@/components/reports/incomeexpenseBarChart";
import ProfitLossChart from "@/components/reports/profitlossChart";
import ReportSummary from "@/components/reports/reportSummary";
import { Button } from "@/components/ui/button";

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

async function downloadReportPdf(report: ReportData) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const autoTable = autoTableModule.default;

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const green: [number, number, number] = [22, 101, 52];
  const orange: [number, number, number] = [216, 118, 14];

  // PDF heading
  doc.setFontSize(18);
  doc.setTextColor(...green);
  doc.text("Farm Performance Report", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

  let currentY = 32;

  // Summary
  doc.setFontSize(13);
  doc.setTextColor(...green);
  doc.text("Summary", 14, currentY);

  autoTable(doc, {
    startY: currentY + 4,
    head: [["Metric", "Amount (KSh)"]],
    body: [
      ["Total Income", report.summary.totalIncome.toLocaleString()],
      ["Total Expenses", report.summary.totalExpenses.toLocaleString()],
      ["Net Profit / Loss", report.summary.profitLoss.toLocaleString()],
    ],
    headStyles: {
      fillColor: green,
    },
  });

  currentY =
    (doc as typeof doc & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? 70;

  // Start a new PDF page if there is not enough vertical space.
  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  // Income categories
  doc.setFontSize(13);
  doc.setTextColor(...green);
  doc.text("Income by Category", 14, currentY + 12);

  autoTable(doc, {
    startY: currentY + 16,
    head: [["Category", "Total (KSh)"]],
    body: report.incomeByCategory.map((item) => [
      item.category,
      item.total.toLocaleString(),
    ]),
    headStyles: {
      fillColor: green,
    },
  });

  currentY =
    (doc as typeof doc & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? currentY + 50;

  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  // Expense categories
  doc.setFontSize(13);
  doc.setTextColor(...orange);
  doc.text("Expenses by Category", 14, currentY + 12);

  autoTable(doc, {
    startY: currentY + 16,
    head: [["Category", "Total (KSh)"]],
    body: report.expenseByCategory.map((item) => [
      item.category,
      item.total.toLocaleString(),
    ]),
    headStyles: {
      fillColor: orange,
    },
  });

  currentY =
    (doc as typeof doc & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? currentY + 50;

  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  // Monthly performance
  doc.setFontSize(13);
  doc.setTextColor(...green);
  doc.text("Monthly Performance", 14, currentY + 12);

  autoTable(doc, {
    startY: currentY + 16,
    head: [["Month", "Income", "Expenses", "Profit / Loss"]],
    body: report.monthly.map((item) => [
      item.month,
      `KSh ${item.income.toLocaleString()}`,
      `KSh ${item.expenses.toLocaleString()}`,
      `KSh ${item.profitLoss.toLocaleString()}`,
    ]),
    headStyles: {
      fillColor: green,
    },
  });

  // Add page numbers.
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(
      `Page ${page} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  doc.save(
    `farm-report-${new Date().toISOString().slice(0, 10)}.pdf`
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await fetch(`/api/report?userId=${userId}`);

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
    <main className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>

          <p className="text-muted-foreground">
            View your income, expenses and business performance.
          </p>
        </div>

        <Button
          className="gap-2 bg-green-700 hover:bg-green-800"
          onClick={() => downloadReportPdf(report)}
        >
          <Download size={18} />
          Download PDF
        </Button>
      </div>

      <ReportSummary
        totalIncome={report.summary.totalIncome}
        totalExpenses={report.summary.totalExpenses}
        profitLoss={report.summary.profitLoss}
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Income Distribution by Category
          </h2>

          {report.incomeByCategory.length > 0 ? (
            <IncomePieChart data={report.incomeByCategory} />
          ) : (
            <p className="text-muted-foreground">
              No income data available for the selected period.
            </p>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Expense Summary
          </h2>

          {report.expenseByCategory.length > 0 ? (
            <ExpensePieChart data={report.expenseByCategory} />
          ) : (
            <p className="text-muted-foreground">
              No expense data available for the selected period.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Income vs Expenses
        </h2>

        <div className="flex h-80 items-center justify-center">
          {report.monthly.length > 0 ? (
            <IncomeExpenseChart data={report.monthly} />
          ) : (
            <p className="text-muted-foreground">
              No transaction data available.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Profit & Loss Trend
        </h2>

        {report.monthly.length > 0 ? (
          <ProfitLossChart data={report.monthly} />
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