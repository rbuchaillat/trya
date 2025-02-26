"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/types/routes";
import {
  AuthorizationTokenResponse,
  CreateConnectSessionResponse,
  CreateUserResponse,
} from "./bridge.types";

const defaultHeaders = {
  "Bridge-Version": "2025-01-15",
  Accept: "application/json",
  "Client-Id": process.env.BRIDGE_CLIENT_ID!,
  "Client-Secret": process.env.BRIDGE_CLIENT_SECRET!,
};

export const createUser = async (userId: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/users",
    {
      method: "POST",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ external_user_id: userId }),
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
    where: { id: userId },
  });

  return data;
};

export const authorizationToken = async (userId: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/authorization/token",
    {
      method: "POST",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ external_user_id: userId }),
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
};

export const storeAccessToken = async (userId: string) => {
  const data = await authorizationToken(userId);

  if (data) {
    await prisma.bridgeToken.create({
      data: {
        access_token: data.access_token,
        expires_at: data.expires_at,
        userId,
      },
    });
  }

  return data;
};

export const refreshAccessToken = async (
  userId: string,
  userTokenId: number
) => {
  const data = await authorizationToken(userId);

  if (data) {
    await prisma.bridgeToken.update({
      data: { access_token: data.access_token, expires_at: data.expires_at },
      where: { id: userTokenId },
    });
  }

  return data;
};

export const getAccessToken = async (userId: string) => {
  const userToken = await prisma.bridgeToken.findFirst({ where: { userId } });

  if (!userToken) {
    const response = await storeAccessToken(userId);
    return response.access_token;
  }

  const now = new Date();
  const expiresAt = new Date(userToken.expires_at);

  if (expiresAt <= now) {
    const response = await refreshAccessToken(userId, userToken.id);
    return response.access_token;
  }

  return userToken.access_token;
};

export const createConnectSession = async (
  userEmail: string,
  accessToken: string
) => {
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
        user_email: userEmail,
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
};

export const deleteItem = async (id: string, accessToken: string) => {
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
};

export const deleteUser = async (
  userId: string,
  bridgeId: string,
  accessToken: string
) => {
  const response = await fetch(
    `https://api.bridgeapi.io/v3/aggregation/users/${bridgeId}`,
    {
      method: "DELETE",
      headers: { ...defaultHeaders, Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status} : ${response.statusText}`);
  }

  await prisma.user.delete({ where: { id: userId } });

  redirect(ROUTES.HOME);
};

export const refreshBankAccount = async (id: number, accessToken: string) => {
  const response = await fetch(
    "https://api.bridgeapi.io/v3/aggregation/connect-sessions",
    {
      method: "POST",
      headers: {
        ...defaultHeaders,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ item_id: id }),
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
};
