import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/types/routes";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex justify-between items-center p-4">
        <Link
          href={ROUTES.HOME}
          className={badgeVariants({ variant: "outline" })}
        >
          Trya
        </Link>
        <Link
          href={ROUTES.SIGNIN}
          className={buttonVariants({ variant: "outline" })}
        >
          Mon compte
        </Link>
      </header>
      {children}
    </main>
  );
}
