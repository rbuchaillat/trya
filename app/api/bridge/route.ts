import { NextRequest } from "next/server";
import { getMonthDates } from "@/utils/date";
import { prisma } from "@/lib/prisma";
import {
  BankAccountResponse,
  ItemResponse,
  ProviderResponse,
  TransactionsResponse,
} from "@/features/bridge/bridge.types";
import {
  classifyTransactionsByCategory,
  updateTransactionsCategory,
} from "@/features/transaction/transaction.action";

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
          const responseItem = await fetch(
            `https://api.bridgeapi.io/v3/aggregation/items/${data.content.item_id}`,
            { headers }
          );

          if (!responseItem.ok) {
            throw new Error(
              `Error fetching data from /items/ ${responseItem.status} : ${responseItem.statusText}`
            );
          }

          const item: ItemResponse = await responseItem.json();

          const responseProvider = await fetch(
            `https://api.bridgeapi.io/v3/providers/${item.provider_id}`,
            { headers }
          );

          if (!responseProvider.ok) {
            throw new Error(
              `Error fetching data from /providers/ ${responseProvider.status} : ${responseProvider.statusText}`
            );
          }

          const provider: ProviderResponse = await responseProvider.json();

          if (user?.bridgeId) {
            await prisma.item.create({
              data: {
                ...item,
                id: item.id.toString(),
                provider_name: provider.name,
                provider_group_name: provider.group_name,
                provider_images_logo: provider.images.logo,
                userId: user.bridgeId,
              },
            });
          }
        } catch (error) {
          console.error("Error from item.created:", error);
        }

        break;

      case "item.refreshed":
        try {
          const {
            account_types,
            item_id,
            status_code,
            status_code_info,
            status_code_description,
            user_uuid,
          } = data.content;

          await prisma.item.update({
            data: {
              account_types,
              status: status_code,
              status_code_info,
              status_code_description,
            },
            where: { id: item_id.toString(), userId: user_uuid },
          });
        } catch (error) {
          console.error("Error from item.refreshed:", error);
        }

        break;

      case "item.account.created":
        try {
          const { startDate } = getMonthDates(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1)
          );
          const minDate = startDate.split("T")[0];

          const [responseBankAccount, responseTransactions] = await Promise.all(
            [
              fetch(
                `https://api.bridgeapi.io/v3/aggregation/accounts/${data.content.account_id}`,
                { headers }
              ),
              fetch(
                `https://api.bridgeapi.io/v3/aggregation/transactions?limit=500&account_id=${data.content.account_id}&min_date=${minDate}`,
                { headers }
              ),
            ]
          );

          if (!responseBankAccount.ok) {
            throw new Error(
              `Error fetching data from /accounts/ ${responseBankAccount.status} : ${responseBankAccount.statusText}`
            );
          }

          if (!responseTransactions.ok) {
            throw new Error(
              `Error fetching data from /transactions/ ${responseTransactions.status} : ${responseTransactions.statusText}`
            );
          }

          const bankAccount: BankAccountResponse =
            await responseBankAccount.json();

          await prisma.bankAccount.create({
            data: {
              ...bankAccount,
              id: bankAccount.id.toString(),
              item_id: bankAccount.item_id.toString(),
            },
          });

          const transactions: TransactionsResponse =
            await responseTransactions.json();

          if (transactions.resources.length !== 0) {
            await prisma.transaction.createMany({
              data: transactions.resources.map((transaction) => ({
                ...transaction,
                id: transaction.id.toString(),
                account_id: transaction.account_id.toString(),
              })),
              skipDuplicates: true,
            });

            const transactionsByCategory = await classifyTransactionsByCategory(
              transactions.resources
            );

            await updateTransactionsCategory(transactionsByCategory);
          }
        } catch (error) {
          console.error("Error from item.account.created:", error);
        }

        break;

      case "item.account.updated":
        try {
          if (data.content.data_access === "enabled") {
            const bankAccount = await prisma.bankAccount.findUnique({
              where: { id: data.content.account_id.toString() },
            });

            if (bankAccount) {
              const since = bankAccount.updated_at.toISOString();
              const minDate = since.split("T")[0];

              const response = await fetch(
                `https://api.bridgeapi.io/v3/aggregation/transactions?account_id=${data.content.account_id}&since=${since}&min_date=${minDate}&limit=500`,
                { headers }
              );

              if (!response.ok) {
                throw new Error(
                  `Error fetching data from /transactions/ ${response.status} : ${response.statusText}`
                );
              }

              await prisma.bankAccount.update({
                data: { balance: data.content.balance, updated_at: new Date() },
                where: { id: data.content.account_id.toString() },
              });

              const transactions: TransactionsResponse = await response.json();

              if (transactions.resources.length !== 0) {
                await prisma.transaction.createMany({
                  data: transactions.resources.map((transaction) => ({
                    ...transaction,
                    id: transaction.id.toString(),
                    account_id: transaction.account_id.toString(),
                  })),
                  skipDuplicates: true,
                });

                const transactionsByCategory =
                  await classifyTransactionsByCategory(transactions.resources);

                await updateTransactionsCategory(transactionsByCategory);
              }
            }
          } else {
            const account = await prisma.bankAccount.findUnique({
              where: { id: data.content.account_id.toString() },
            });

            if (account) {
              await prisma.bankAccount.delete({
                where: { id: account.id },
              });
            }
          }
        } catch (error) {
          console.error("Error from item.account.updated:", error);
        }

        break;

      case "item.account.deleted":
        try {
          await prisma.bankAccount.delete({
            where: { id: data.content.account_id.toString() },
          });
        } catch (error) {
          console.error("Error from item.account.deleted:", error);
        }

        break;

      default:
        // Gérer les autres types d'événements non pris en charge
        console.log("Unsupported event type:", data.type);
        break;
    }

    return new Response("Webhook success", { status: 200 });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, { status: 500 });
  }
}
