import { ROUTES } from "@/types/routes";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <nav>
        <Link href={ROUTES.SIGNIN}>Mon compte</Link>
      </nav>
      <section>
        <h1>Trya App</h1>
      </section>
    </main>
  );
}
