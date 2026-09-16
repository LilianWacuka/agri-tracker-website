import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/app/services/transaction";

// a function to handle the GET request for fetching transactions
export async function GET(request: NextRequest) {
    try {
        // Extract the userId from the query parameters
        const userId = request.nextUrl.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json(
                { message: "UserId is Required" },
                { status: 400 }
            );
        }
        // fetch all transactions for this user
        const transactions = await getTransactions(userId);

        //separate income and expenses
        const incomeTransactions = transactions.filter((transaction) => transaction.type === "income");
        const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");
        
        //calculate both total income and expenses
        const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
        const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
        const profitLoss = totalIncome - totalExpenses;

        //calculate income&expenses by category
        const incomeCategoryMap: Record<string, number> = {};
        incomeTransactions.forEach((transaction) => {
            if (!incomeCategoryMap[transaction.category]) {
                incomeCategoryMap[transaction.category] = 0;
            }
            incomeCategoryMap[transaction.category] += transaction.total;
        });
        const incomeByCategory = Object.entries(incomeCategoryMap).map(
            ([category, total]) => ({
                category,
                total,
            })
        );

        const expenseCategoryMap: Record<string, number> = {};
        expenseTransactions.forEach((transaction) => {
            if (!expenseCategoryMap[transaction.category]) {
                expenseCategoryMap[transaction.category] = 0;
            }
            expenseCategoryMap[transaction.category] += transaction.total;
        });
        const expenseByCategory = Object.entries(expenseCategoryMap).map(
            ([category, total]) => ({
                category,
                total,
            })
        );
        
        const monthlyMap: Record<string, { income: number; expenses: number }> = {};

        transactions.forEach((transaction) => {
            const date = new Date(transaction.date);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");

            const monthKey = `${year}-${month}`;

            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = { income: 0, expenses: 0 };
            }

            if (transaction.type === "income") {
                monthlyMap[monthKey].income += transaction.total;
            }

            if (transaction.type === "expense") {
                monthlyMap[monthKey].expenses += transaction.total;
            }
        });

        const monthly = Object.entries(monthlyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, values]) => ({
                month,
                income: values.income,
                expenses: values.expenses,
                profitLoss: values.income - values.expenses,
            }));

        return NextResponse.json(
            {
                message: "Transactions fetched successfully",
                summary: {
                    totalIncome,
                    totalExpenses,
                    profitLoss,
                },
                incomeByCategory,
                expenseByCategory,
                monthly,
                transactions,
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while fetching transactions" },
            { status: 500 }
        );
    }
}