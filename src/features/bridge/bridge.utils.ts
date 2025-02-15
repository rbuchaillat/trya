"use server";

import { prisma } from "@/lib/prisma";
import { authorizationToken } from "./bridge.action";

export const getAccessToken = async (userId: string) => {
  const userToken = await prisma.userToken.findFirst({
    where: { userId },
  });

  if (!userToken) {
    const data = await refreshAccessToken(userId);
    return data.access_token;
  }

  const now = new Date();
  const expiresAt = new Date(userToken.expires_at);

  if (expiresAt <= now) {
    const data = await refreshAccessToken(userId);
    return data.access_token;
  }

  return userToken.access_token;
};

export const refreshAccessToken = async (userId: string) => {
  return await authorizationToken(userId);
};
