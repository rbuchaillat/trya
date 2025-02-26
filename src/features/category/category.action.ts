"use server";

import { prisma } from "@/lib/prisma";

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
};

export const getCategoriesWithTransactions = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate: string;
  endDate: string;
}) => {
  const categories = await prisma.category.findMany({
    where: { transactions: { some: { bankAccount: { item: { userId } } } } },
    include: {
      transactions: { where: { date: { gte: startDate, lte: endDate } } },
    },
  });
  return categories.filter(
    (category) =>
      category.name !== "Revenus" && category.name !== "Virement interne"
  );
};
