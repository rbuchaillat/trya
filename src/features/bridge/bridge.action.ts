"use server";

import { prisma } from "@/lib/prisma";

const clientId = process.env.BRIDGE_CLIENT_ID;
const clientSecret = process.env.BRIDGE_CLIENT_SECRET;

export const createUser = async (userId: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/users",
    {
      method: "POST",
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Content-Type": "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
      },
      body: JSON.stringify({
        external_user_id: userId,
      }),
    }
  );

  const data = await response.json();

  if (data) {
    await prisma.user.update({
      data: {
        isCreatedOnBridge: true,
      },
      where: {
        id: userId,
      },
    });
  }

  return data;
};

export const authorizationToken = async (userId: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/authorization/token",
    {
      method: "POST",
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Content-Type": "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
      },
      body: JSON.stringify({
        external_user_id: userId,
      }),
    }
  );

  const data = await response.json();

  if (data) {
    await prisma.userToken.create({
      data: {
        access_token: data.access_token,
        expires_at: data.expires_at,
        userId,
      },
    });
  }

  return data;
};

export const createConnectSession = async (
  accessToken: string,
  userEmail: string
) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/connect-sessions",
    {
      method: "POST",
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Content-Type": "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_email: userEmail,
      }),
    }
  );

  const data = await response.json();
  return data;
};

export const getItems = async (accessToken: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/items",
    {
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getProviderById = async (id: string, accessToken: string) => {
  const response = await fetch(`https://api.bridgeapi.io/v3/providers/${id}`, {
    headers: {
      "Bridge-Version": "2025-01-15",
      Accept: "application/json",
      "Client-Id": clientId!,
      "Client-Secret": clientSecret!,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
};

export const getAccounts = async (accessToken: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/accounts",
    {
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getAccountsByItemId = async (
  itemId: number,
  accessToken: string
) => {
  const response = await fetch(
    `https://api.bridgeapi.io/v3/aggregation/accounts?item_id=${itemId}`,
    {
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getTransactions = async (accessToken: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/transactions",
    {
      headers: {
        "Bridge-Version": "2025-01-15",
        Accept: "application/json",
        "Client-Id": clientId!,
        "Client-Secret": clientSecret!,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};
