"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const incomeCategories = [
  "Chick Sale",
  "Live Meat",
  "Hen Sale",
  "Egg Sale",
  "Manure",
  "Feathers",
];

export function IncomeForm({ onSuccess,}: {onSuccess: () => void;}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault();
    const form = e.currentTarget;

    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    // Get logged in user's ID
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.get("name"),
      userId,
      category: formData.get("category"),
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      paymentMethod: formData.get("paymentMethod"),
      date: formData.get("date"),
    };

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to record income.");
        return;
      }

      setMessage("Income recorded successfully.");

      // Clear the form
      form.reset();

      // Refresh parent component
      onSuccess();

      // Refresh page data
      router.refresh();

    } catch (error) {
      console.error("Error adding income:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 w-full max-w-5xl">
    <Card className="p-6 w-full md:w-1/2 mx-auto shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Record Income
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Income Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Income Name
          </label>

          <Input
            name="name"
            placeholder="Example: Morning Egg Sales"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Category
          </label>

          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option
              value=""
              disabled
            >
              Select Income Category
            </option>

            {incomeCategories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Quantity
            </label>

            <Input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Price Per Unit (KES)
            </label>

            <Input
              type="number"
              name="price"
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Payment Method
          </label>

          <select
            name="paymentMethod"
            required
            defaultValue=""
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option
              value=""
              disabled
            >
              Select Payment Method
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="M-Pesa">
              M-Pesa
            </option>

            <option value="Bank Transfer">
              Bank Transfer
            </option>
          </select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Date
          </label>

          <Input
            type="date"
            name="date"
            required
          />
        </div>

        {/* Message */}
        {message && (
          <div className="rounded-md bg-gray-100 p-3 text-center text-sm">
            {message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Income"}
        </Button>
      </form>
    </Card>
    </div>
  );
}