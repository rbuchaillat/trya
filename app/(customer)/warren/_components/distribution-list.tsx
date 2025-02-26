"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChartPieIcon, HandCoinsIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTransactionsByUserId } from "@/features/transaction/transaction.action";
import { requiredCurrentUser } from "@/features/user/user.action";
import {
  categorizeBudget,
  getBudgetPlan,
  getIncomeTransactions,
  getIncomeValue,
  mergeExpenses,
  UserTransactions,
} from "@/features/category/category.utils";
import { getMonthDates } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Charts } from "./charts";

function isWithinLimitOrSlightlyAbove(current: number, total: number): boolean {
  return current <= total || current <= total * 1.05;
}

function isModeratelyAboveLimit(current: number, total: number): boolean {
  return current > total * 1.05 && current <= total * 1.15;
}

function isSignificantlyAboveLimit(current: number, total: number): boolean {
  return current > total * 1.15;
}

function isAboveOrNotTooBelow(current: number, total: number): boolean {
  return current >= total || current >= total * 0.95;
}

function isModeratelyBelow(current: number, total: number): boolean {
  return current < total * 0.95 && current >= total * 0.85;
}

function isSignificantlyBelow(current: number, total: number): boolean {
  return current < total * 0.85;
}

export const DistributionList = () => {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") ?? new Date().getFullYear();
  const month = searchParams.get("month") ?? new Date().getMonth();

  const [userTransactions, setUserTransactions] = useState<UserTransactions>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await requiredCurrentUser();
        const transactions = await getTransactionsByUserId({
          userId: user.id,
          ...getMonthDates(new Date(year + "-" + month)),
        });
        if (transactions) setUserTransactions(transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, month]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const hasTransactions = userTransactions?.items.some((item) =>
    item.bankAccounts.some((bankAccount) => bankAccount.transactions.length > 0)
  );

  if (!userTransactions || !hasTransactions) {
    return <div>Aucune transaction pour cette période</div>;
  }

  const { needs, savings, wants } = categorizeBudget(userTransactions);

  const totalExpenses = needs.total + wants.total + savings.total;

  const needsPercentage = Math.round((needs.total / totalExpenses) * 100);
  const wantsPercentage = Math.round((wants.total / totalExpenses) * 100);
  const savingsPercentage = Math.round((savings.total / totalExpenses) * 100);

  const income = getIncomeValue(getIncomeTransactions(userTransactions));

  const { bracket, plan } = getBudgetPlan(+income);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div className="bg-slate-100 p-1.5 rounded-md">
                <ChartPieIcon size={14} className="text-slate-500" />
              </div>
              <span className="text-slate-800 font-medium">
                Votre répartition budgétaire
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <div className="w-6" />
              <div className="flex gap-1 items-center">
                <div className="size-3 rounded-full bg-blue-400" /> Besoins (
                {needsPercentage}%)
              </div>
              <div className="flex gap-1 items-center">
                <div className="size-3 rounded-full bg-green-400" /> Envies (
                {wantsPercentage}%)
              </div>
              <div className="flex gap-1 items-center">
                <div className="size-3 rounded-full bg-yellow-400" /> Épargne (
                {savingsPercentage}%)
              </div>
            </div>
          </div>
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
        </div>
        <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
          <div className="flex gap-2 items-start">
            <div className="bg-slate-100 p-1.5 rounded-md">
              <ChartPieIcon size={14} className="text-slate-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-medium">
                Répartition budgétaire recommandée
              </span>
              <span className="text-xs text-slate-500 italic">
                basé sur vos revenus:{" "}
                <span className="font-bold">{income} €</span>
              </span>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="w-6" />
            <div className="flex gap-1 items-center">
              <div className="size-3 rounded-full bg-blue-400" /> Besoins (
              {bracket.needs}%)
            </div>
            <div className="flex gap-1 items-center">
              <div className="size-3 rounded-full bg-green-400" /> Envies (
              {bracket.wants}%)
            </div>
            <div className="flex gap-1 items-center">
              <div className="size-3 rounded-full bg-yellow-400" /> Épargne (
              {bracket.savings}%)
            </div>
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
        </div>
      </div>

      <div>
        <div className="flex gap-2 items-center pb-4">
          <div className="bg-slate-100 p-1.5 rounded-md">
            <HandCoinsIcon size={14} className="text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-800 font-medium">
              Récapitulatif des dépenses:{" "}
              <span className="font-bold">{totalExpenses.toFixed(2)} €</span>
            </span>
            <span className="text-xs text-slate-500 italic">
              Comparez vos dépenses réelles avec celles recommandées. Visualisez
              rapidement si vous êtes sur la bonne voie pour une gestion
              financière équilibrée !
            </span>
          </div>
        </div>
        <Accordion
          className="bg-white rounded-xl shadow-md overflow-hidden"
          type="single"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="items-center">
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-4 items-center">
                  <div className="size-8 rounded-full bg-blue-400" />
                  <div className="text-sm">Besoins</div>
                </div>
                <strong>
                  <span
                    className={cn({
                      "text-green-500": isWithinLimitOrSlightlyAbove(
                        needs.total,
                        plan.needs
                      ),
                      "text-orange-500": isModeratelyAboveLimit(
                        needs.total,
                        plan.needs
                      ),
                      "text-red-500": isSignificantlyAboveLimit(
                        needs.total,
                        plan.needs
                      ),
                    })}
                  >
                    {needs.total} €
                  </span>{" "}
                  / {plan.needs} €
                </strong>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {mergeExpenses(needs.expenses).map((needExpense, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-x-2 py-2 ml-[52px] border-b text-xs border-gray-100 text-slate-500 justify-between items-center"
                  >
                    <div className="flex gap-x-3">
                      <div className="size-3 rounded-full bg-blue-400" />
                      {needExpense.clean_description}
                    </div>
                    <strong>
                      {needExpense.amount.toFixed(2)}{" "}
                      <span className="text-slate-300">€</span>
                    </strong>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="items-center">
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-4 items-center">
                  <div className="size-8 rounded-full bg-green-400" />
                  <div className="text-sm">Envies</div>
                </div>
                <strong>
                  <span
                    className={cn({
                      "text-green-500": isWithinLimitOrSlightlyAbove(
                        wants.total,
                        plan.wants
                      ),
                      "text-orange-500": isModeratelyAboveLimit(
                        wants.total,
                        plan.wants
                      ),
                      "text-red-500": isSignificantlyAboveLimit(
                        wants.total,
                        plan.wants
                      ),
                    })}
                  >
                    {wants.total} €
                  </span>{" "}
                  / {plan.wants} €
                </strong>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {mergeExpenses(wants.expenses).map((needExpense, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-x-2 py-2 ml-[52px] border-b text-xs border-gray-100 text-slate-500 justify-between items-center"
                  >
                    <div className="flex gap-x-3">
                      <div className="size-3 rounded-full bg-green-400" />
                      {needExpense.clean_description}
                    </div>
                    <strong>
                      {needExpense.amount.toFixed(2)}{" "}
                      <span className="text-slate-300">€</span>
                    </strong>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="items-center">
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-x-4 items-center">
                  <div className="size-8 rounded-full bg-yellow-400" />
                  <div className="text-sm">Épargne</div>
                </div>
                <strong>
                  <span
                    className={cn({
                      "text-green-500": isAboveOrNotTooBelow(
                        savings.total,
                        plan.savings
                      ),
                      "text-orange-500": isModeratelyBelow(
                        savings.total,
                        plan.savings
                      ),
                      "text-red-500": isSignificantlyBelow(
                        savings.total,
                        plan.savings
                      ),
                    })}
                  >
                    {savings.total} €
                  </span>{" "}
                  / {plan.savings} €
                </strong>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {mergeExpenses(savings.expenses).map((needExpense, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-x-2 py-2 ml-[52px] border-b text-xs border-gray-100 text-slate-500 justify-between items-center"
                  >
                    <div className="flex gap-x-3">
                      <div className="size-3 rounded-full bg-yellow-400" />
                      {needExpense.clean_description}
                    </div>
                    <strong>
                      {needExpense.amount.toFixed(2)}{" "}
                      <span className="text-slate-300">€</span>
                    </strong>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
