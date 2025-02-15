"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  actionClient,
  authActionClient,
  authActionClientWithAccessToken,
} from "@/lib/safe-action";
import {
  AccountResponse,
  AccountsResponse,
  AuthorizationTokenResponse,
  CreateConnectSessionResponse,
  CreateUserResponse,
  ItemsResponse,
  ProviderResponse,
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
      headers: {
        ...defaultHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_user_id: user.id,
      }),
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
    data: {
      isCreatedOnBridge: true,
    },
    where: {
      id: user.id,
    },
  });

  return data;
});

export const authorizationToken = authActionClient.action(
  async ({ ctx: { user } }) => {
    const response = await fetch(
      "https://api.bridgeapi.io/v3/aggregation/authorization/token",
      {
        method: "POST",
        headers: {
          ...defaultHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_user_id: user.id,
        }),
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

export const getItems = authActionClientWithAccessToken.action(
  async ({ ctx: { accessToken } }) => {
    const response = await fetch(
      "https://api.bridgeapi.io/v3/aggregation/items",
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: ItemsResponse = await response.json();

    if (!data) {
      throw new Error("Error getting items");
    }

    return data;
  }
);

export const getProviderById = authActionClientWithAccessToken
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
    const response = await fetch(
      `https://api.bridgeapi.io/v3/providers/${id}`,
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: ProviderResponse = await response.json();

    if (!data) {
      throw new Error("Error getting provider");
    }

    return data;
  });

export const getAccountsByItemId = authActionClientWithAccessToken
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
    const response = await fetch(
      `https://api.bridgeapi.io/v3/aggregation/accounts?item_id=${id}`,
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: AccountsResponse = await response.json();

    if (!data) {
      throw new Error("Error getting accounts");
    }

    return data;
  });

export const getAccount = authActionClientWithAccessToken
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
    const response = await fetch(
      `https://api.bridgeapi.io/v3/aggregation/accounts/${id}`,
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: AccountResponse = await response.json();

    if (!data) {
      throw new Error("Error getting account");
    }

    return data;
  });

export const getTransactions = authActionClientWithAccessToken.action(
  async ({ ctx: { accessToken } }) => {
    const response = await fetch(
      "https://api.bridgeapi.io/v3/aggregation/transactions",
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: TransactionsResponse = await response.json();

    if (!data) {
      throw new Error("Error getting transactions");
    }

    return data;
  }
);

export const getTransactionsByAccountId = authActionClientWithAccessToken
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
    const response = await fetch(
      `https://api.bridgeapi.io/v3/aggregation/transactions?account_id=${id}`,
      {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }

    const data: TransactionsResponse = await response.json();

    if (!data) {
      throw new Error("Error getting transaction");
    }

    return data;
  });

export const storeAccessToken = authActionClient.action(
  async ({ ctx: { user } }) => {
    const { data } = (await authorizationToken()) ?? {};

    if (data) {
      await prisma.userToken.create({
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
  .schema(
    z.object({
      userTokenId: z.number(),
    })
  )
  .action(async ({ parsedInput: { userTokenId } }) => {
    const { data } = (await authorizationToken()) ?? {};

    if (data) {
      await prisma.userToken.update({
        data: {
          access_token: data.access_token,
          expires_at: data.expires_at,
        },
        where: {
          id: userTokenId,
        },
      });
    }

    return data;
  });
