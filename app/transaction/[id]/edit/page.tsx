import { getTransactionById } from "@/app/services/transaction";
import TransactionEditForm from "@/components/transactions/transactionEditForm";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  if (!transaction) return <div className="p-8">Transaction not found</div>;

  // serialize date to string for client
  const serialized = {
    ...transaction,
    date: transaction.date ? new Date(transaction.date).toISOString() : undefined,
  } as any;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Edit transaction</h1>
      <TransactionEditForm transaction={serialized} />
    </div>
  );
}
