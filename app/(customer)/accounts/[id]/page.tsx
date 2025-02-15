import { getTransactionsByAccountId } from "@/features/bridge/bridge.action";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { data: transactions } =
    (await getTransactionsByAccountId({ id: +id })) ?? {};

  return (
    <div>
      {transactions?.resources.map((transaction) => {
        return (
          <div key={transaction.id} className="flex justify-between">
            <div>{transaction.clean_description}</div>
            <div>
              {transaction.amount}
              {transaction.currency_code}
            </div>
          </div>
        );
      })}
    </div>
  );
}
