"use client";
import { IncomeForm } from "@/components/transactions/incomeForm";
import { ExpenseForm } from "@/components/transactions/expenseForm";
import { TransactionTable } from "@/components/transactions/transactionTable";


export default function TransactionPage() {
    return (
        <div className="p-4 sm:p-10 space-y-8">     
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <IncomeForm onSuccess={() => {}} />
            <ExpenseForm  onSuccess={() =>{}}/>
     
        </div>
        <TransactionTable transactions={[]} onDelete={() => {}} />
        </div>
    );

}