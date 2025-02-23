import { GlobalBalance } from "./_components/global-balance";

export default async function Dashboard() {
  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-8">
        <GlobalBalance />
      </div>
    </section>
  );
}
