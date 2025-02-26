"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMonthDates } from "@/utils/date";
import { Category, Transaction } from "@prisma/client";
import { cn } from "@/lib/utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import { getCategoriesWithTransactions } from "@/features/category/category.action";
import { COLORS, ICONS } from "@/features/category/category.constant";
import { Charts } from "./charts";

type CategoryWithTransactions = Category & {
  transactions: Transaction[];
};

export const CategoryList = () => {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") ?? new Date().getFullYear();
  const month = searchParams.get("month") ?? new Date().getMonth() + 1;

  const [categories, setCategories] = useState<CategoryWithTransactions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await requiredCurrentUser();
        if (!user.bridgeId) return;
        const categories = await getCategoriesWithTransactions({
          userId: user.bridgeId,
          ...getMonthDates(new Date(year + "-" + month)),
        });
        setCategories(categories);
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

  const categoriesWithTransactionsValueSorted = categories
    .map((category) => ({
      ...category,
      value: category.transactions.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.amount || 0),
        0
      ),
    }))
    .sort((a, b) => a.value - b.value);

  const totalAmount = categoriesWithTransactionsValueSorted.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.value || 0),
    0
  );

  return (
    <div>
      <div className="flex flex-col gap-y-1 items-center pb-8">
        <div>
          Total des dépenses:{" "}
          <strong>
            {(-totalAmount).toFixed(2)}{" "}
            <span className="text-slate-300">€</span>
          </strong>
        </div>
        <Charts
          data={categoriesWithTransactionsValueSorted
            .filter((transaction) => transaction.value < 0)
            .map((transaction) => ({
              ...transaction,
              value: Math.abs(transaction.value),
            }))}
          colors={categoriesWithTransactionsValueSorted.map(
            (category) => COLORS[category.name].oklch
          )}
        />
      </div>
      <Accordion
        className="bg-white rounded-xl shadow-md"
        type="single"
        collapsible
      >
        {categoriesWithTransactionsValueSorted.map((category) => {
          const Icon = ICONS[category.name];
          const percent =
            totalAmount !== 0
              ? ((category.value / totalAmount) * 100).toFixed(2)
              : 0;
          return (
            <AccordionItem key={category.id} value={`item-${category.id}`}>
              <AccordionTrigger className="items-center">
                <div className="flex w-full justify-between items-center">
                  <div className="flex gap-x-4 items-center">
                    <div
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center",
                        COLORS[category.name].cn
                      )}
                    >
                      <Icon width={18} height={18} color="white" />
                    </div>
                    <div className="grid">
                      <div className="text-sm">{category.name}</div>
                      <div className="text-xs text-slate-400">
                        {`${+percent > 0 ? percent : 0}% - ${
                          category.transactions.length
                        } transaction${
                          category.transactions.length > 1 ? "s" : ""
                        }`}
                      </div>
                    </div>
                  </div>
                  <strong>
                    {-category.value.toFixed(2)}{" "}
                    <span className="text-slate-300">€</span>
                  </strong>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {category.transactions
                  .sort((a, b) => a.amount - b.amount)
                  .map((transaction) => {
                    return (
                      <div
                        key={transaction.id}
                        className="flex gap-x-2 py-2 ml-[52px] border-b text-xs border-gray-100 text-slate-500 justify-between items-center"
                      >
                        <div className="flex gap-x-3">
                          <div
                            className={cn(
                              "size-3 rounded-full",
                              COLORS[category.name].cn
                            )}
                          />
                          {transaction.clean_description}
                        </div>
                        <strong>
                          {transaction.amount}{" "}
                          <span className="text-slate-300">€</span>
                        </strong>
                      </div>
                    );
                  })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
