import {
  categorizeBudget,
  getBudgetPlan,
  getIncomeTransactions,
  getIncomeValue,
  mergeExpenses,
} from "@/features/category/category.utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";
import { formatDateWithMonth, getLastMonthDates } from "@/utils/date";
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
            where: {
              type: "checking",
            },
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

  const { needs, savings, wants } = categorizeBudget(userTransactions);

  const totalExpenses = needs.total + wants.total + savings.total;

  const needsPercentage = Math.round((needs.total / totalExpenses) * 100);
  const wantsPercentage = Math.round((wants.total / totalExpenses) * 100);
  const savingsPercentage = Math.round((savings.total / totalExpenses) * 100);

  const income = getIncomeValue(getIncomeTransactions(userTransactions));

  const { bracket, plan } = getBudgetPlan(+income);

  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>
        Gestion du budget de{" "}
        <strong className="underline">
          {formatDateWithMonth(
            new Date(new Date().setMonth(new Date().getMonth() - 1))
          )}
        </strong>
      </h1>
      {userTransactions.items.length !== 0 && (
        <div className="flex flex-col gap-y-5">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
              <h2>Votre répartition budgétaire</h2>
              <div className="mx-auto h-[200px]">
                <Charts
                  data={[
                    { value: needs.total },
                    { value: wants.total },
                    { value: savings.total },
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
              <div>
                <h2>La répartition budgétaire recommandée*</h2>
                <span className="text-xs text-slate-500">
                  *Basé sur vos revenus ({income}€)
                </span>
              </div>
              <div className="mx-auto h-[200px]">
                <Charts
                  data={[
                    { value: bracket.needs },
                    { value: bracket.wants },
                    { value: bracket.savings },
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
                  pour vos besoins ({bracket.needs}%)
                </div>
                <div className="flex gap-2 items-center">
                  <div className="size-3 rounded-full bg-green-400" /> Dépenses
                  dédiés à vos envies ({bracket.wants}%)
                </div>
                <div className="flex gap-2 items-center">
                  <div className="size-3 rounded-full bg-yellow-400" /> Dépenses
                  pour votre épargne ({bracket.savings}%)
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
            <h2>
              Récapitulatif des dépenses (
              {(needs.total + wants.total + savings.total).toFixed(2)}€)
            </h2>
            <div className="grid gap-y-4 text-xs">
              <div className="grid gap-y-2">
                <strong className="flex gap-3 items-center">
                  <div className="size-4 rounded-full bg-yellow-400" /> Dépenses
                  pour votre épargne ({savings.total}€/{plan.savings}€)
                </strong>
                <div className="grid gap-y-0.5">
                  {mergeExpenses(savings.expenses).map(
                    (savingExpense, index) => {
                      return (
                        <div key={index}>
                          {savingExpense.clean_description}:{" "}
                          {Math.abs(savingExpense.amount).toFixed(2)}€
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="grid gap-y-2">
                <strong className="flex gap-3 items-center">
                  <div className="size-4 rounded-full bg-green-400" /> Dépenses
                  pour vos envies ({wants.total}€/{plan.wants}€)
                </strong>
                <div className="grid gap-y-0.5">
                  {mergeExpenses(wants.expenses).map((wantExpense, index) => {
                    return (
                      <div key={index}>
                        {wantExpense.clean_description}:{" "}
                        {Math.abs(wantExpense.amount).toFixed(2)}€
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-y-2">
                <strong className="flex gap-3 items-center">
                  <div className="size-4 rounded-full bg-blue-400" /> Dépenses
                  pour vos besoins ({needs.total}€/{plan.needs}€)
                </strong>
                <div className="grid gap-y-0.5">
                  {mergeExpenses(needs.expenses).map((needExpense, index) => {
                    return (
                      <div key={index}>
                        {needExpense.clean_description}:{" "}
                        {Math.abs(needExpense.amount).toFixed(2)}€
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
