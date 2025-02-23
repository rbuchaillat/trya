import { Balance } from "./_components/balance";
import { BankAccountCounter } from "./_components/bank-account-counter";
import { LastTranslations } from "./_components/last-translations";

export default async function Dashboard() {
  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>Indicateurs</h1>
      <div className="grid grid-cols-3 gap-8">
        <Balance />
        <BankAccountCounter />
      </div>
      <h2 className="mt-4">Graphiques</h2>
      <div className="grid grid-cols-2 gap-8">
        <LastTranslations />
      </div>
    </section>
  );
}
