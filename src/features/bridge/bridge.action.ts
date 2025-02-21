"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/types/routes";
import {
  actionClient,
  authActionClient,
  authActionClientWithAccessToken,
} from "@/lib/safe-action";
import {
  classifyTransactionsByCategory,
  updateTransactionsCategory,
} from "@/features/transaction/transaction.action";
import {
  AuthorizationTokenResponse,
  BankAccountResponse,
  CreateConnectSessionResponse,
  CreateUserResponse,
  TransactionsResponse,
} from "./bridge.types";

const defaultHeaders = {
  "Bridge-Version": "2025-01-15",
  Accept: "application/json",
  "Client-Id": process.env.BRIDGE_CLIENT_ID!,
  "Client-Secret": process.env.BRIDGE_CLIENT_SECRET!,
};

export const createUser = authActionClient.action(async ({ ctx: { user } }) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/users",
    {
      method: "POST",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ external_user_id: user.id }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status} : ${response.statusText}`);
  }

  const data: CreateUserResponse = await response.json();

  if (!data) {
    throw new Error("Error creating user");
  }

  await prisma.user.update({
    data: { bridgeId: data.uuid },
    where: { id: user.id },
  });

  return data;
});

export const authorizationToken = authActionClient.action(
  async ({ ctx: { user } }) => {
    const response = await fetch(
      "https://api.bridgeapi.io/v3/aggregation/authorization/token",
      {
        method: "POST",
        headers: { ...defaultHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ external_user_id: user.id }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: AuthorizationTokenResponse = await response.json();

    if (!data) {
      throw new Error("Error getting authorization token");
    }

    return data;
  }
);

export const createConnectSession = authActionClientWithAccessToken.action(
  async ({ ctx: { user, accessToken } }) => {
    const response = await fetch(
      "https://api.bridgeapi.io/v3/aggregation/connect-sessions",
      {
        method: "POST",
        headers: {
          ...defaultHeaders,
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_email: user.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: CreateConnectSessionResponse = await response.json();

    if (!data) {
      throw new Error("Error creating connect session");
    }

    return data;
  }
);

export const deleteItem = authActionClientWithAccessToken
  .schema(z.object({ id: z.string() }))
  .action(async ({ ctx: { accessToken }, parsedInput: { id } }) => {
    const response = await fetch(
      `https://api.bridgeapi.io/v3/aggregation/items/${id}`,
      {
        method: "DELETE",
        headers: { ...defaultHeaders, Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    await prisma.item.delete({ where: { id } });

    revalidatePath(ROUTES.ACCOUNTS);
  });

export const refreshBankAccounts = authActionClientWithAccessToken.action(
  async ({ ctx: { user, accessToken } }) => {
    const userWithBankAccounts = await prisma.user.findUnique({
      where: { id: user.id },
      include: { items: { include: { bankAccounts: true } } },
    });

    const bankAccounts = userWithBankAccounts?.items.flatMap(
      (item) => item.bankAccounts
    );

    if (!bankAccounts) return;

    await Promise.all(
      bankAccounts.map(async (bankAccount) => {
        const since = bankAccount.updated_at.toISOString();
        const minDate = since.split("T")[0];

        const [responseBankAccount, responseTransactions] = await Promise.all([
          fetch(
            `https://api.bridgeapi.io/v3/aggregation/accounts/${bankAccount.id}`,
            {
              headers: {
                ...defaultHeaders,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
          fetch(
            `https://api.bridgeapi.io/v3/aggregation/transactions?account_id=${bankAccount.id}&since=${since}&min_date=${minDate}`,
            {
              headers: {
                ...defaultHeaders,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
        ]);

        const transactions: TransactionsResponse =
          await responseTransactions.json();

        const _bankAccount: BankAccountResponse =
          await responseBankAccount.json();

        if (transactions.resources.length > 0) {
          await Promise.all([
            prisma.transaction.createMany({
              data: transactions.resources.map((transaction) => ({
                ...transaction,
                id: transaction.id.toString(),
                account_id: transaction.account_id.toString(),
              })),
              skipDuplicates: true,
            }),
            prisma.bankAccount.update({
              data: {
                balance: _bankAccount.balance,
                updated_at: _bankAccount.updated_at,
              },
              where: { id: bankAccount.id },
            }),
          ]);

          const transactionsByCategory = await classifyTransactionsByCategory(
            transactions.resources
          );

          await updateTransactionsCategory(transactionsByCategory);
        }
      })
    );

    revalidatePath(ROUTES.ACCOUNTS);
  }
);

/*
  These functions manage the lifecycle of the access token.
*/

export const storeAccessToken = authActionClient.action(
  async ({ ctx: { user } }) => {
    const { data } = (await authorizationToken()) ?? {};

    if (data) {
      await prisma.bridgeToken.create({
        data: {
          access_token: data.access_token,
          expires_at: data.expires_at,
          userId: user.id,
        },
      });
    }

    return data;
  }
);

export const refreshAccessToken = actionClient
  .schema(z.object({ userTokenId: z.number() }))
  .action(async ({ parsedInput: { userTokenId } }) => {
    const { data } = (await authorizationToken()) ?? {};

    if (data) {
      await prisma.bridgeToken.update({
        data: { access_token: data.access_token, expires_at: data.expires_at },
        where: { id: userTokenId },
      });
    }

    return data;
  });
