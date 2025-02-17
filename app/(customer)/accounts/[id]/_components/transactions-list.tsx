import { Chip } from "@/components/ui/chip";
import { getTransactionsByAccountId } from "@/features/bridge/bridge.action";
import { cn } from "@/lib/utils";
import { formatDateWithShortMonth } from "@/utils/date";

export const TransactionsList = async (props: { accountId: number }) => {
  const { accountId } = props;

  const transactionsResponse = await getTransactionsByAccountId({
    id: accountId,
  });
  const transactions = transactionsResponse?.data;

  if (!transactions) return null;

  return (
    <table className="bg-white rounded-xl shadow-md">
      <thead>
        <tr className="h-10 text-xs border-b border-gray-100">
          <th className="px-5">Date</th>
          <th>Méthode</th>
          <th className="text-left px-2.5">Intitulé de l&apos;opération</th>
          <th className="text-right px-2.5">Montant</th>
          <th className="text-left px-2.5">Label</th>
        </tr>
      </thead>
      <tbody>
        {transactions
          .sort(
            (a, b) =>
              new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          )
          .map((transaction) => {
            const date = new Date(transaction.date ?? 0);
            return (
              <tr
                key={transaction.id}
                className="h-10 border-b border-gray-100"
              >
                <td className="text-center px-5">
                  <div className="text-sm">
                    {formatDateWithShortMonth(date)}
                  </div>
                  {date.getFullYear() !== new Date().getFullYear() && (
                    <div className="text-xs">{date.getFullYear()}</div>
                  )}
                </td>
                <td className="text-center">{transaction.operation_type}</td>
                <td className="px-2.5">{transaction.clean_description}</td>
                <td
                  className={cn("text-right px-2.5", {
                    "text-emerald-400": transaction.amount > 0,
                  })}
                >
                  {transaction.amount} €
                </td>
                <td className="px-2.5">
                  {transaction.category?.name && (
                    <Chip label={transaction.category.name} />
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
