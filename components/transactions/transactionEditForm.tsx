"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function TransactionEditForm({ transaction }: { transaction: any }) {
  const [name, setName] = useState(transaction.name || "");
  const [category, setCategory] = useState(transaction.category || "");
  const [price, setPrice] = useState(String(transaction.price ?? "0"));
  const [quantity, setQuantity] = useState(String(transaction.quantity ?? "0"));
  const [date, setDate] = useState(transaction.date ? transaction.date.slice(0, 10) : "");
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod || "");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/transaction", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transaction.id, name, category, price, quantity, date, paymentMethod }),
      });
      if (res.ok) {
        router.push(`/transaction/${transaction.id}`);
        alert("Transaction updated successfully");
      } else {
        const err = await res.json();
        alert(err?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating transaction");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Price</label>
        <Input value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Payment Method</label>
        <Input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
      </div>
      <div>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
