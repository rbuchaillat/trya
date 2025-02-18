import { GlobalBalance } from "./_components/global-balance";

export default async function Dashboard() {
  return (
    <section className="bg-slate-100 rounded-2xl p-4 flex flex-col gap-y-5 min-h-[85vh]">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-8">
        <GlobalBalance />
      </div>
    </section>
  );
}
