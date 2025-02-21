import { currentUser } from "@/features/user/user.action";
import { createSafeActionClient } from "next-safe-action";
import { getAccessToken } from "@/features/bridge/bridge.utils";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error("Action error:", e.message);
    return { errorMessage: e.message };
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  return next({ ctx: { user } });
});

export const authActionClientWithAccessToken = authActionClient.use(
  async ({ next, ctx: { user } }) => {
    const accessToken = await getAccessToken(user.id);

    if (!accessToken) {
      throw new Error("Access Token not found");
    }

    return next({ ctx: { accessToken } });
  }
);
