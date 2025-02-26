"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

  const categoriesWithTransactionsValueSorted = categories
    .map((category) => ({
      ...category,
      value: Math.abs(
        category.transactions.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.amount || 0),
          0
        )
      ),
    }))
    .sort((a, b) => b.value - a.value);

  const totalAmount = categoriesWithTransactionsValueSorted.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.value || 0),
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      const user = await requiredCurrentUser();
      if (!user.bridgeId) return;

      const categories = await getCategoriesWithTransactions({
        userId: user.bridgeId,
        ...getMonthDates(new Date(year + "-" + month)),
      });
      setCategories(categories);
    };
    fetchData();
  }, [year, month]);

  return (
    <div>
      <div className="flex flex-col gap-y-1 items-center pb-8">
        <div>
          Total des dépenses:{" "}
          <strong>
            {totalAmount.toFixed(2)} <span className="text-slate-300">€</span>
          </strong>
        </div>
        <Charts
          data={categoriesWithTransactionsValueSorted}
          colors={categoriesWithTransactionsValueSorted.map(
            (category) => COLORS[category.name].oklch
          )}
        />
      </div>
      <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-4">
        {categoriesWithTransactionsValueSorted.map((category) => {
          const Icon = ICONS[category.name];
          return (
            <div
              key={category.id}
              className="flex gap-x-2 p-1 border-b border-gray-100 justify-between items-center"
            >
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
                    {`${((category.value / totalAmount) * 100).toFixed(2)}% - ${
                      category.transactions.length
                    } transaction${
                      category.transactions.length > 1 ? "s" : ""
                    }`}
                  </div>
                </div>
              </div>
              <strong>
                {Math.abs(category.value).toFixed(2)}{" "}
                <span className="text-slate-300">€</span>
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};
