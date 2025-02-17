"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  actionClient,
  authActionClient,
  authActionClientWithAccessToken,
} from "@/lib/safe-action";
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
        body: JSON.stringify({ user_email: user.email }),
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
