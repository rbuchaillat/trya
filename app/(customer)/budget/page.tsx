import { categorizeBudget } from "@/features/category/category.utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";
import { formatDateWithLongMonth, getLastMonthDates } from "@/utils/date";
import { Charts } from "./_components/charts";

export default async function Budget() {
  const user = await requiredCurrentUser();

  const { startDate, endDate } = getLastMonthDates();

  const userTransactions = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      items: {
        include: {
          bankAccounts: {
            include: {
              transactions: {
                where: {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userTransactions) return null;

  const { needsExpenses, savingsExpenses, wantsExpenses } =
    categorizeBudget(userTransactions);

  const totalExpenses = needsExpenses + savingsExpenses + wantsExpenses;

  const needsPercentage = Math.round((needsExpenses / totalExpenses) * 100);
  const wantsPercentage = Math.round((wantsExpenses / totalExpenses) * 100);
  const savingsPercentage = Math.round((savingsExpenses / totalExpenses) * 100);

  return (
    <section className="bg-slate-100 rounded-2xl p-4 flex flex-col gap-y-5 min-h-[85vh]">
      <h1>
        Gestion du budget de{" "}
        <strong className="capitalize">
          {formatDateWithLongMonth(
            new Date(new Date().setMonth(new Date().getMonth() - 1))
          )}
        </strong>
      </h1>
      {userTransactions.items.length !== 0 && (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
            <h2>Votre répartition budgétaire</h2>
            <div className="mx-auto h-[200px]">
              <Charts
                data={[
                  { value: needsExpenses },
                  { value: wantsExpenses },
                  { value: savingsExpenses },
                ]}
                colors={[
                  "oklch(.707 .165 254.624)",
                  "oklch(.792 .209 151.711)",
                  "oklch(.852 .199 91.936)",
                ]}
              />
            </div>
            <div className="grid gap-1 text-xs">
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-blue-400" /> Dépenses
                pour vos besoins ({needsPercentage}%)
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-green-400" /> Dépenses
                dédiés à vos envies ({wantsPercentage}%)
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-yellow-400" /> Dépenses
                pour votre épargne ({savingsPercentage}%)
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
            <h2>La répartition budgétaire recommandée</h2>
            <div className="mx-auto h-[200px]">
              <Charts
                data={[{ value: 50 }, { value: 30 }, { value: 20 }]}
                colors={[
                  "oklch(.707 .165 254.624)",
                  "oklch(.792 .209 151.711)",
                  "oklch(.852 .199 91.936)",
                ]}
              />
            </div>
            <div className="grid gap-1 text-xs">
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-blue-400" /> Dépenses
                pour vos besoins (50%)
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-green-400" /> Dépenses
                dédiés à vos envies (30%)
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-yellow-400" /> Dépenses
                pour votre épargne (20%)
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
