"use client";

import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
  paymentMethod: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onDelete }: Props) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Qty</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Date</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => {
              const isExpense =
                tx.category === "Electricity" ||
                tx.category === "Water" ||
                tx.category === "Transport" ||
                tx.category === "Miscellaneous";

              return (
                <tr key={tx.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isExpense
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isExpense ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-medium">{tx.category}</td>

                  <td className="p-4 text-gray-600">{tx.name}</td>

                  <td className="p-4">{tx.quantity}</td>

                  <td className="p-4">
                    Ksh {tx.price.toLocaleString()}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      isExpense ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isExpense ? "-" : "+"}
                    Ksh {tx.total.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-xs">
                      {tx.paymentMethod}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(tx.date).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(tx.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}