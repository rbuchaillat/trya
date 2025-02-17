"use server";

import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { TransactionResponse } from "@/features/bridge/bridge.types";

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
        content: `Here are banking transaction descriptions: "${transactionsList}". Based on the following categories: ${categoriesList}, what is the corresponding category for each transaction? Please return the results as a list of transaction ID and category ID pairs, with each pair separated by a semicolon. Provide only the list of transaction ID:category ID pairs, with no additional information, text, or explanation.`,
      },
    ],
    model: "gpt-3.5-turbo",
    //   model: "gpt-4-turbo",
  });

  const openaiResponse =
    response.choices[0]?.message?.content?.trim() || "Unknown";

  const data = openaiResponse.split(";").map((pair) => {
    const [transactionId, categoryId] = pair.split(":");
    return { transactionId, categoryId };
  });

  return data;
};
