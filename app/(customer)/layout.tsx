import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { badgeVariants } from "@/components/ui/badge";
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
    <main className="text-slate-600">
      <header className="flex justify-between items-center p-4">
        <Link
          href={ROUTES.DASHBOARD}
          className={badgeVariants({ variant: "outline" })}
        >
          Trya
        </Link>
        <div className="flex gap-x-2">
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
      </header>
      <div className="flex">
        <nav className="basis-1/6 p-4">
          <ul className="grid gap-y-3">
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
          </ul>
        </nav>
        <div className="basis-5/6 p-4">{children}</div>
      </div>
    </main>
  );
}
