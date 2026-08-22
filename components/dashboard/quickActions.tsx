"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  List,
  X,
} from "lucide-react";

import { IncomeForm } from "@/components/transactions/incomeForm";
import { ExpenseForm } from "@/components/transactions/expenseForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ActiveForm = "income" | "expense" | null;

export function QuickActions() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Quick Actions</h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* Opens the existing income form. */}
          <Button
            className="justify-start gap-2 bg-green-700 hover:bg-green-800"
            onClick={() => setActiveForm("income")}
          >
            <ArrowUpRight size={18} />
            Record Income
          </Button>

          {/* Opens the existing expense form. */}
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setActiveForm("expense")}
          >
            <ArrowDownRight size={18} />
            Record Expense
          </Button>

          <Button asChild variant="outline" className="justify-start gap-2">
            <Link href="/report">
              <BarChart3 size={18} />
              View Reports
            </Link>
          </Button>

          <Button asChild variant="outline" className="justify-start gap-2">
            <Link href="/transaction">
              <List size={18} />
              All Transactions
            </Link>
          </Button>
        </div>
      </Card>

      {/* Show a form only after its matching quick-action button is clicked. */}
      {activeForm && (
        <Card className="relative max-w-2xl p-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3"
            onClick={() => setActiveForm(null)}
            aria-label="Close form"
          >
            <X size={18} />
          </Button>

          {activeForm === "income" ? (
            <IncomeForm onSuccess={() => setActiveForm(null)} />
          ) : (
            <ExpenseForm onSuccess={() => setActiveForm(null)} />
          )}
        </Card>
      )}
    </div>
  );
}