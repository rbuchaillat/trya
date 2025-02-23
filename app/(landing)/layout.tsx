import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/types/routes";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex justify-between items-center p-4 fixed top-0 w-full bg-white">
        <Link href={ROUTES.HOME} className="font-black text-2xl">
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
      <footer className="bg-gray-900 text-white py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Trya. Tous droits réservés.
          </p>
          <nav className="mt-2">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link href="#" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
}
