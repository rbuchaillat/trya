import { redirect } from "next/navigation";
import { currentUser } from "@/features/user/user.action";
import { ROUTES } from "@/types/routes";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) redirect(ROUTES.DASHBOARD);

  return <main>{children}</main>;
}
