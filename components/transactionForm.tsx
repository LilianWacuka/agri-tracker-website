"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface TransactionFormProps{
    editingTransaction? : any;
    onSuccess:()=>void
}
type TransactionType = "income | expense";
export function TransactionForm({
    editingTransaction, onSuccess,
}: TransactionFormProps){
    const[transactionType, setTransactionType]= useState("");
    const[category, setCategory]= useState("");
    const[quantity, setQuantity]= useState("");
    const[price, setPrice]= useState("");
    const[paymentMethod, setPaymentMethod]= useState("");
    const[date, setDate]= useState("");
    const[isLoading, setIsLoading]= useState(false);
    const[message, setMessage]= useState("");

    useEffect(()=>{
        if(editingTransaction){
            setTransactionType(editingTransaction.transactionType);
            setCategory(editingTransaction.category);
            setQuantity(editingTransaction.quantity?.toString() || "");
            setPrice(editingTransaction.price?.toString() || "");
            setPaymentMethod(editingTransaction.paymentMethod || "");
            setDate(
                editingTransaction.date
                    ? new Date(editingTransaction.date).toISOString().split("T")[0]
                    : ""
            );
        }
    }, [editingTransaction]);
        const total = Number(quantity || 0) * Number(price || 0)
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
        try{
            setIsLoading(true);
            setMessage("");
            const userId = localStorage.getItem("userId");
            const payload ={
                id: editingTransaction?.id, userId, name: category, transactionType, 
                category, quantity, price,paymentMethod, date
            };
            const response = await fetch("/api/transaction",
                {
                    method: editingTransaction? "PATCH":"POST",
                    headers: {"Content-Type": "application/JSON",
                    },
                    body: JSON.stringify(payload),

                });
            const data = await response.json();
            if(!response.ok){
                setMessage(data.message);
                return;
            }
            setMessage(editingTransaction? "Transaction Updated": "Transaction added");
            setCategory("");
            setQuantity("");
            setPrice("");
            setDate("");
            setPaymentMethod("");
            onSuccess();

        }catch(error){setMessage("Something went wrong");
        }finally{setIsLoading(false)};
    }

    return(
        <Card>
            <h2>{editingTransaction? "update Transaction": "New Transcation"}</h2>
            <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <select
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value)
          }
          className="w-full border rounded-md p-2"
        >
          <option value="">
            Income
          </option>

          <option value="">
            Expense
          </option>
        </select>

        <Input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <Input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-full border rounded-md p-2"
        >
          <option>Cash</option>
          <option>M-Pesa</option>
          <option>Bank Transfer</option>
        </select>

        <div className="font-semibold">
          Total: Ksh {total}
        </div>

        {message && (
          <p className="text-sm">
            {message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : editingTransaction
            ? "Update Transaction"
            : "Save Transaction"}
        </Button>
      </form>
        </Card>
    )
}
