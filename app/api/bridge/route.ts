import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  BankAccountResponse,
  ItemResponse,
  ProviderResponse,
  TransactionsResponse,
} from "@/features/bridge/bridge.types";
import { classifyTransactionsByCategory } from "@/features/category/category.action";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const user = await prisma.user.findUnique({
      where: { bridgeId: data.content.user_uuid },
      include: { bridgeToken: true },
    });

    const headers = {
      "Bridge-Version": "2025-01-15",
      Accept: "application/json",
      "Client-Id": process.env.BRIDGE_CLIENT_ID!,
      "Client-Secret": process.env.BRIDGE_CLIENT_SECRET!,
      Authorization: `Bearer ${user?.bridgeToken?.access_token}`,
    };

    switch (data.type) {
      case "item.created":
        try {
          const responseItems = await fetch(
            `https://api.bridgeapi.io/v3/aggregation/items/${data.content.item_id}`,
            { headers }
          );

          if (!responseItems.ok) {
            throw new Error(
              "Error fetching data from Bridge API (item.created)"
            );
          }

          const items: ItemResponse = await responseItems.json();

          const responseProvider = await fetch(
            `https://api.bridgeapi.io/v3/providers/${items.provider_id}`,
            { headers }
          );

          if (!responseProvider.ok) {
            throw new Error(
              "Error fetching data from Bridge API (item.created)"
            );
          }

          const provider: ProviderResponse = await responseProvider.json();

          if (user?.bridgeId) {
            await prisma.item.create({
              data: {
                ...items,
                provider_name: provider.name,
                provider_group_name: provider.group_name,
                provider_images_logo: provider.images.logo,
                userId: user.bridgeId,
              },
            });
          }
        } catch (error) {
          console.error("Error during API call or database operation:", error);
        }

        break;

      case "item.refreshed":
        try {
          await prisma.item.update({
            data: {
              account_types: data.content.account_types,
              status: data.content.status_code,
              status_code_info: data.content.status_code_info,
              status_code_description: data.content.status_code_description,
            },
            where: {
              id: data.content.item_id,
              userId: data.content.user_uuid,
            },
          });
        } catch (error) {
          console.error(
            "Error updating item in the database (item.refreshed):",
            error
          );
        }

        break;

      case "item.account.created":
        try {
          const [responseAccount, responseTransactions] = await Promise.all([
            fetch(
              `https://api.bridgeapi.io/v3/aggregation/accounts/${data.content.account_id}`,
              { headers }
            ),
            fetch(
              `https://api.bridgeapi.io/v3/aggregation/transactions?limit=500&account_id=${data.content.account_id}`,
              { headers }
            ),
          ]);

          if (!responseAccount.ok || !responseTransactions.ok) {
            throw new Error(
              "Error fetching data from Bridge API (item.account.created)"
            );
          }

          const account: BankAccountResponse = await responseAccount.json();
          const transactions: TransactionsResponse =
            await responseTransactions.json();

          await prisma.bankAccount.create({
            data: account,
          });

          await prisma.transaction.createMany({
            data: transactions.resources,
            skipDuplicates: true,
          });

          const transactionsByCategory = await classifyTransactionsByCategory(
            transactions.resources
          );

          const updateQuery = transactionsByCategory
            .map(({ transactionId, categoryId }) => {
              return `WHEN id = ${transactionId} THEN ${categoryId}`;
            })
            .join(" ");

          const query = `
            UPDATE "Transaction"
            SET "categoryId" = CASE
              ${updateQuery}
              ELSE "categoryId"
            END
            WHERE "id" IN (${transactionsByCategory
              .map((pair) => pair.transactionId)
              .join(", ")})
          `;

          await prisma.$executeRawUnsafe(query);
        } catch (error) {
          console.error("Error during API call or database operation:", error);
        }

        break;

      case "item.account.updated":
        try {
          if (data.content.data_access === "enabled") {
            const bankAccountUpdated = await prisma.bankAccount.update({
              data: { balance: data.content.balance },
              where: { id: data.content.account_id },
            });

            const since = bankAccountUpdated.updated_at.toISOString();

            const response = await fetch(
              `https://api.bridgeapi.io/v3/aggregation/transactions?since=${since}&account_id=${data.content.account_id}`,
              { headers }
            );

            if (!response.ok) {
              throw new Error(
                "Error fetching data from Bridge API (item.account.updated)"
              );
            }

            const transactions: TransactionsResponse = await response.json();

            await Promise.all([
              prisma.transaction.createMany({
                data: transactions.resources,
                skipDuplicates: true,
              }),
              prisma.bankAccount.update({
                data: { updated_at: new Date() },
                where: { id: data.content.account_id },
              }),
            ]);

            const transactionsByCategory = await classifyTransactionsByCategory(
              transactions.resources
            );

            const updateQuery = transactionsByCategory
              .map(({ transactionId, categoryId }) => {
                return `WHEN id = ${transactionId} THEN ${categoryId}`;
              })
              .join(" ");

            const query = `
              UPDATE "Transaction"
              SET "categoryId" = CASE
                ${updateQuery}
                ELSE "categoryId"
              END
              WHERE "id" IN (${transactionsByCategory
                .map((pair) => pair.transactionId)
                .join(", ")})
            `;

            await prisma.$executeRawUnsafe(query);
          } else {
            const account = await prisma.bankAccount.findUnique({
              where: { id: data.content.account_id },
            });

            if (account) {
              await prisma.bankAccount.delete({
                where: { id: account.id },
              });
            }
          }
        } catch (error) {
          console.error("Error during API call or database operation:", error);
        }

        break;

      case "item.account.deleted":
        try {
          await prisma.bankAccount.delete({
            where: { id: data.content.account_id },
          });
        } catch (error) {
          console.error(
            "Error updating item in the database (item.account.deleted):",
            error
          );
        }

        break;

      default:
        // Gérer les autres types d'événements non pris en charge
        console.log("Type d'événement non pris en charge:", data.type);
        break;
    }

    return new Response("Webhook reçu avec succès", {
      status: 200,
    });
  } catch (error) {
    return new Response(`Erreur lors du traitement du webhook: ${error}`, {
      status: 500,
    });
  }
}
