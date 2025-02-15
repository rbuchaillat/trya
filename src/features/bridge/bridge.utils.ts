"use server";

import { prisma } from "@/lib/prisma";
import { refreshAccessToken, storeAccessToken } from "./bridge.action";

export const getAccessToken = async (userId: string) => {
  const userToken = await prisma.userToken.findFirst({
    where: { userId },
  });

  if (!userToken) {
    const response = await storeAccessToken();
    return response?.data?.access_token;
  }

  const now = new Date();
  const expiresAt = new Date(userToken.expires_at);

  if (expiresAt <= now) {
    const response = await refreshAccessToken({ userTokenId: userToken.id });
    return response?.data?.access_token;
  }

  return userToken.access_token;
};
