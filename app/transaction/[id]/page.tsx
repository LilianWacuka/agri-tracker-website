import { getTransactionById } from "@/app/services/transaction";
import TransactionActions from "@/components/transactions/transactionActions";

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  if (!transaction) return <div className="p-8">Transaction not found</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Transaction details</h1>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div>
          <strong>Type:</strong> {transaction.type}
        </div>
        <div>
          <strong>Category:</strong> {transaction.category}
        </div>
        <div>
          <strong>Name:</strong> {transaction.name}
        </div>
        <div>
          <strong>Quantity:</strong> {transaction.quantity}
        </div>
        <div>
          <strong>Price:</strong> ksh {transaction.price?.toLocaleString?.() ?? transaction.price}
        </div>
        <div>
          <strong>Total:</strong> ksh {transaction.total?.toLocaleString?.() ?? transaction.total}
        </div>
        <div>
          <strong>Date:</strong> {transaction.date ? new Date(transaction.date).toLocaleDateString() : "-"}
        </div>
        <div>
          <strong>Payment:</strong> {transaction.paymentMethod}
        </div>
      </div>

      <TransactionActions id={transaction.id} />
    </div>
  );
}
