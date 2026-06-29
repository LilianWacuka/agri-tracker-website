import {createTransaction, getTransactions, updateTransaction, deleteTransaction} from "@/app/services/transaction";
import { NextRequest, NextResponse } from "next/server";
//create transaction
export async function POST(request: NextRequest) {
    try{
        const { name, userId, category, price, quantity, paymentMethod, date } = await request.json();

        if (!name || !userId || !category || price == null || quantity == null || !paymentMethod) {
            return NextResponse.json({ message: "Missing required transaction fields" }, { status: 400 });
        }

        const transaction = await createTransaction(name, userId, category, price, quantity, paymentMethod, date);
        return NextResponse.json({ transaction, message: "Transaction created successfully" }, { status: 201 });
    }catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Error creating transaction" }, { status: 500 });
    }
}
//get transactions by user id
export async function GET(request: NextRequest){
    try{
        const userId = request.nextUrl.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ message: "Missing userId parameter" }, { status: 400 });
        }
        const transaction = await getTransactions(userId);
        return NextResponse.json(transaction, { status: 200 });
    }catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ message: "Error fetching transactions" }, { status: 500 });
    }
}
//update partial transaction
export async function PATCH(request: NextRequest) {
    try {
        const { id, name, category, price, quantity, date, paymentMethod } = await request.json();
        if (!id) {
            return NextResponse.json({ message: "Missing transaction id" }, { status: 400 });
        }
        const transaction = await updateTransaction(id, name, category, price, quantity, date, paymentMethod);
        return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ message: "Error updating transaction" }, { status: 500 });
    }
}
// delete transaction
export async function DELETE(request: NextRequest){
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "Missing transaction id" }, { status: 400 });
        }
        await deleteTransaction(id);
        return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });

    }catch(error){
        console.error("Error deleting transaction:", error);
        return NextResponse.json({ message: "Error deleting transaction" }, { status: 500 });
    }
}