import { AccountInfo } from "./_components/account-info";
import { TransactionsList } from "./_components/transactions-list";

export default async function Account({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <section className="grid gap-y-5 bg-slate-100 rounded-2xl p-4">
      <h1>Transactions</h1>
      <AccountInfo id={+id} />
      <TransactionsList accountId={+id} />
    </section>
  );
}
