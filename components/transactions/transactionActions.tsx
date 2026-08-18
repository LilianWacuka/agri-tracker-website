"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

export default function TransactionActions({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transaction?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting transaction");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/transaction/${id}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil size={16} />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500">
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
