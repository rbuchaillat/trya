import { SignOutButton } from "@/components/utils/signout-button";
import { requiredCurrentUser } from "@/features/user/user.action";
import { ROUTES } from "@/types/routes";
import Image from "next/image";
import Link from "next/link";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requiredCurrentUser();

  return (
    <section className="grid gap-y-4">
      <div className="flex gap-x-2">
        <h1>Bienvenue {user.name}</h1>
        {user.image && (
          <Image src={user.image} width={25} height={25} alt="User Avatar" />
        )}
        <SignOutButton />
      </div>

      <nav>
        <ul className="flex gap-x-2">
          <li className="border p-1 rounded-xs">
            <Link href={ROUTES.DASHBOARD}>Trya Logo</Link>
          </li>
          <li className="border p-1 rounded-xs">
            <Link href={ROUTES.ACCOUNTS}>Comptes</Link>
          </li>
          <li className="border p-1 rounded-xs">
            <Link href={ROUTES.FINANCIAL}>Revenus & Dépenses</Link>
          </li>
        </ul>
      </nav>

      {children}
    </section>
  );
}
