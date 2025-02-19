import { CategoryChip } from "@/components/utils/category-chip";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { formatDateWithShortMonth } from "@/utils/date";

export const TransactionsList = async (props: { accountId: string }) => {
  const { accountId } = props;

  const user = await requiredCurrentUser();

  const userWithTransactions = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      items: {
        include: {
          bankAccounts: {
            where: { id: accountId },
            include: {
              transactions: {
                include: {
                  category: true,
                },
                orderBy: [{ date: "desc" }, { id: "asc" }],
              },
            },
          },
        },
      },
    },
  });

  const transactions = userWithTransactions?.items.flatMap((item) =>
    item.bankAccounts.flatMap((bankAccount) => bankAccount.transactions)
  );

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
        {transactions.map((transaction) => {
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
                  transactionId={transaction.id}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
