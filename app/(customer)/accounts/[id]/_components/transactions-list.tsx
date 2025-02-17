import { CategoryChip } from "@/components/utils/category-chip";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { formatDateWithShortMonth } from "@/utils/date";

export const TransactionsList = async (props: { accountId: number }) => {
  const { accountId } = props;

  const transactions = await prisma.transaction.findMany({
    where: { account_id: accountId },
    include: { category: true },
  });

  if (!transactions) return null;

  return (
    <table className="bg-white rounded-xl shadow-md w-full">
      <thead className="text-slate-400">
        <tr className="h-10 text-xs border-b border-gray-100">
          <th className="px-5 font-medium w-28">Date</th>
          <th className="text-left px-2.5 w-1/5 font-medium">
            Intitulé de l&apos;opération
          </th>
          <th className="text-right px-2.5 font-medium">Montant</th>
          <th className="text-left px-2.5 w-1/2 font-medium">Catégorie</th>
        </tr>
      </thead>
      <tbody className="text-xs">
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
                className="h-10 border-b border-gray-100 hover:bg-slate-100 group/transaction"
              >
                <td className="text-center px-5">
                  <div>{formatDateWithShortMonth(date)}</div>
                  {date.getFullYear() !== new Date().getFullYear() && (
                    <div className="text-[8px]">{date.getFullYear()}</div>
                  )}
                </td>
                <td className="px-2.5 font-semibold group-hover/transaction:font-bold">
                  {transaction.clean_description}
                </td>
                <td
                  className={cn("text-right px-2.5 font-bold", {
                    "text-emerald-400": transaction.amount > 0,
                  })}
                >
                  {transaction.amount} €
                </td>
                <td className="px-2.5">
                  <CategoryChip
                    label={transaction.category?.name}
                    transactionId={+transaction.id.toString()}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
