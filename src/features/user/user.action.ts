"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { ROUTES } from "@/types/routes";
import { User } from "@prisma/client";

export const currentUser = async () => {
  const session = await auth();

  if (!session?.user) return null;

  return session.user as User;
};

export const requiredCurrentUser = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not found");

  return user;
};

export const signInWithGoogleAction = async () => {
  await signIn("google", { redirectTo: ROUTES.DASHBOARD });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: ROUTES.HOME });
};
