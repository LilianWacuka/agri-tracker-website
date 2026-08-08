"use client";
import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Transaction{
  id: string;
  type: "income" | "expense";
  name: string;
  category: string;
  quantity: string;
  price: string;
  total: string;
  paymentMethod: string;
  date: string;
}
export function TransactionTable(){
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);
  const fetchTransactions = async () =>{
    try{
      const userId = localStorage.getItem("userId");
      if(!userId) return;
      const response = await fetch(`/api/transaction?userId=${userId}`);
      const data = await response.json();
      if (response.ok){
        setTransactions(data.transaction ?? []);
      }
    } catch (error){
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(id: string){
    const confirmDelete = window.confirm("Delete this transaction?");
    if (!confirmDelete) return;
    try{
      const response = await fetch(`/api/transaction/${id}`,{
        method: "DELETE",
      })
      if (response.ok){
        setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      }
    } catch (error){
      console.error("Error deleting transaction:", error);
    }
  }
  const categories = useMemo(() => {
    return [ ...new Set(transactions.map((transaction) => transaction.category)),
    ]
  }, [transactions]);
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.name.toLowerCase().includes(search.toLowerCase()) || transaction.category.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;

    return (matchesSearch && matchesType && matchesCategory)
  });

  if (loading) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        Loading transactions...
      </p>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search transactions" className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <select className="border rounded-md px-3 py-2"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>

        </select>
        <select className="border rounded-md px-3 py-2"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {/* // the table of transactions */}
      <div className="overflow-x-auto ronded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-4">Type</th>
              <th className="p-4">Category</th>
              <th className="p-4">Name</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ?(
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) =>(
                <tr key={transaction.id} className="border-t hover:bg-gray-50">

                  <td className="p-4">
                    {transaction.type === "income" ? (
                      <TrendingUp className="text-green-500" size={20} />
                    ) : (
                      <TrendingDown className="text-red-500" size={20} />
                    )}
                  </td>
                  <td className="p-4">{transaction.category}</td>
                  <td className="p-4">{transaction.name}</td>
                  <td className="p-4">{transaction.quantity}</td>
                  <td className="p-4">ksh{""}{transaction.price.toLocaleString()}</td>
                  <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="p-4">{transaction.paymentMethod}</td>
                  <td className="p-4 space-x-2">
                    <Button variant="ghost" size="sm">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  )
}