import { currentUser } from "@/features/user/user.action";
import { ROUTES } from "@/types/routes";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) redirect(ROUTES.DASHBOARD);

  return <section>{children}</section>;
}
