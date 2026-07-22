"use client";
import { IncomeForm } from "@/components/incomeForm";
import { ExpenseForm } from "@/components/expenseForm";


export default function TransactionPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <IncomeForm onSuccess={() => {}} />
            <ExpenseForm  onSuccess={() =>{}}/>
     
        </div>
    );

}