"use client";
import { IncomeForm } from "@/components/incomeForm";
import { ExpenseForm } from "@/components/expenseForm";

export default function TransactionPage() {
    return (
        <>
            <IncomeForm onSuccess={() => {}} />
            <ExpenseForm  onSuccess={() =>{}}/>
        </>
    );

}