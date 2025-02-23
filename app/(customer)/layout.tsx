import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { SignOutButton } from "@/components/utils/signout-button";
import { requiredCurrentUser } from "@/features/user/user.action";
import { ROUTES } from "@/types/routes";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requiredCurrentUser();

  return (
    <main className="text-slate-600 flex">
      <div className="basis-1/6 p-4 gap-y-4 flex flex-col">
        <Link href={ROUTES.DASHBOARD} className="font-black text-2xl py-1">
          Trya
        </Link>
        <nav>
          <ul className="grid gap-y-3 py-4">
            <li>
              <Link
                href={ROUTES.ACCOUNTS}
                className={buttonVariants({ variant: "outline" })}
              >
                Comptes
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.BUDGET}
                className={buttonVariants({ variant: "outline" })}
              >
                Gestion du budget
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.SETTINGS}
                className={buttonVariants({ variant: "outline" })}
              >
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="basis-5/6 p-4 gap-y-4 flex flex-col bg-slate-100 min-h-screen">
        <div className="flex gap-x-2 justify-end">
          {user.image && (
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <SignOutButton />
        </div>
        {children}
      </div>
    </main>
  );
}
