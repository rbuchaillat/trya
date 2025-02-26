import { AddBankButton } from "./_components/add-bank-button";
import { AccountsList } from "./_components/accounts-list";

export default async function Accounts() {
  return (
    <section className="grid gap-y-5 p-4">
      <div className="flex gap-4 items-center justify-between">
        <h1>Mes comptes bancaires</h1>
      </div>
      <AccountsList />
      <div>
        <AddBankButton />
      </div>
    </section>
  );
}
