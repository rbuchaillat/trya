"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMonthDates } from "@/utils/date";
import { Category, Transaction } from "@prisma/client";
import { cn } from "@/lib/utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import { getCategoriesWithTransactions } from "@/features/category/category.action";
import { COLORS } from "@/features/category/category.constant";
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
      <div className="flex justify-center">
        <Charts
          data={categoriesWithTransactionsValueSorted}
          colors={categoriesWithTransactionsValueSorted.map(
            (category) => COLORS[category.name].oklch
          )}
        />
      </div>
      <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-4">
        {categoriesWithTransactionsValueSorted.map((category) => {
          return (
            <div
              key={category.id}
              className="flex gap-x-2 p-1 border-b border-gray-100 justify-between items-center"
            >
              <div className="flex gap-x-2 items-center">
                <div
                  className={cn(
                    "size-3 rounded-full",
                    COLORS[category.name].cn
                  )}
                />{" "}
                {category.name}
              </div>
              <strong>{Math.abs(category.value).toFixed(2)} €</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};
