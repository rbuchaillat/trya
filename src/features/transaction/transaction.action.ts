"use server";

import { revalidatePath } from "next/cache";
import { TransactionResponse } from "@/features/bridge/bridge.types";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/types/routes";

export const addTransitionCategory = async (id: string, categoryId: number) => {
  const transaction = await prisma.transaction.update({
    where: { id },
    data: { categoryId },
  });
  revalidatePath(ROUTES + "/" + transaction.account_id);
};

export const removeTransitionCategory = async (id: string) => {
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
    messages: [
      {
        role: "system",
        content:
          "You are a model capable of classifying banking transaction descriptions into various categories. Each category has a unique identifier.",
      },
      {
        role: "user",
        content: `Here are banking transaction descriptions: "${transactionsList}". Based on the following categories: ${categoriesList}, what is the corresponding category for each transaction? Make sure not to assign a category randomly. Please return the results as a list of transaction ID and category ID pairs, with each pair separated by a semicolon. Provide only the list of transaction ID:category ID pairs, with no additional information, text, or explanation. If no category can be determined, do not return anything for that transaction.`,
      },
    ],
    model: "gpt-4o",
  });

  const openaiResponse =
    response.choices[0]?.message?.content?.trim() || "Unknown";

  const data = openaiResponse.split(";").map((pair) => {
    const [transactionId, categoryId] = pair.split(":");
    return { transactionId, categoryId };
  });

  return data;
};
