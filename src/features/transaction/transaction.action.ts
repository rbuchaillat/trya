"use server";

import { revalidatePath } from "next/cache";
import { TransactionResponse } from "@/features/bridge/bridge.types";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/types/routes";

export const addTransactionCategory = async (
  id: string,
  categoryId: number
) => {
  const transaction = await prisma.transaction.update({
    where: { id },
    data: { categoryId },
  });
  revalidatePath(ROUTES + "/" + transaction.account_id);
};

export const removeTransactionCategory = async (id: string) => {
  const transaction = await prisma.transaction.update({
    where: { id },
    data: { categoryId: null },
  });
  revalidatePath(ROUTES + "/" + transaction.account_id);
};

export const classifyTransactionsByCategory = async (
  transactions: TransactionResponse[]
) => {
  const categories = await prisma.category.findMany();

  const categoriesList = categories
    .map((category) => `${category.name}:${category.id}`)
    .join(";");

  const transactionsList = transactions
    .map((transaction) => `${transaction.clean_description}:${transaction.id}`)
    .join(";");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an AI that categorizes banking transactions based on a predefined list of categories. " +
          "Your task is to analyze each transaction description and match it to the most relevant category from the provided list. " +
          "Categories are provided as 'categoryName:categoryId'. Transactions are provided as 'transactionName:transactionId'. " +
          "Your response should only contain transactionId:categoryId pairs, separated by semicolons (;). " +
          "If a transaction does not match any category, assign 'unknown' instead of a category ID.",
      },
      {
        role: "user",
        content: `Here is the list of categories with their IDs (format: categoryName:categoryId):
          ${categoriesList}
    
          Here is the list of transactions with their IDs (format: transactionName:transactionId):
          ${transactionsList}
    
          Please analyze the transaction descriptions and categorize them accordingly. 
          If a transaction does not match any category, return 'unknown' as its category ID. 
          Your response should only contain transactionId:categoryId pairs, separated by semicolons (;), like this:
          transactionId:categoryId; transactionId:categoryId; transactionId:categoryId; ...`,
      },
    ],
  });

  const openaiResponse =
    response.choices[0]?.message?.content?.trim() || "Unknown";

  const data = openaiResponse
    .split(";")
    .map((pair) => {
      const [transactionId, categoryId] = pair
        .split(":")
        .map((item) => item.trim());
      return categoryId !== "unknown" ? { transactionId, categoryId } : null;
    })
    .filter(Boolean) as { transactionId: string; categoryId: string }[];

  return data;
};

export const updateTransactionsCategory = async (
  transactionsByCategory: {
    transactionId: string;
    categoryId: string;
  }[]
) => {
  if (
    !Array.isArray(transactionsByCategory) ||
    transactionsByCategory.length === 0
  ) {
    console.error("Error: transactionsByCategory must be a non-empty array");
    return;
  }

  const sanitizedTransactions = transactionsByCategory.filter(
    ({ transactionId, categoryId }) => {
      if (!transactionId || !categoryId) {
        console.warn(`Invalid transaction skipped (empty values):`, {
          transactionId,
          categoryId,
        });
        return false;
      }

      if (!/^\d+$/.test(transactionId)) {
        console.warn(
          `Invalid transactionId skipped (must be only numbers): ${transactionId}`
        );
        return false;
      }

      if (!/^\d+$/.test(categoryId)) {
        console.warn(
          `Invalid categoryId skipped (must be only numbers): ${categoryId}`
        );
        return false;
      }

      return true;
    }
  );

  if (sanitizedTransactions.length === 0) {
    console.error("Error: No valid transactions to update");
    return;
  }

  const updateQuery = sanitizedTransactions
    .map(({ transactionId, categoryId }) => {
      return `WHEN id = '${transactionId}' THEN ${categoryId}`;
    })
    .join(" ");

  const query = `
      UPDATE "Transaction"
      SET "categoryId" = CASE
        ${updateQuery}
        ELSE "categoryId"
      END
      WHERE "id" IN (${sanitizedTransactions
        .map(({ transactionId }) => `'${transactionId}'`)
        .join(", ")})
    `;

  try {
    await prisma.$executeRawUnsafe(query);
  } catch (error) {
    console.error("Database update error:", error);
  }
};
