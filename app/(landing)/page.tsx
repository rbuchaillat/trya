import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/types/routes";

export default function Home() {
  return (
    <section className="grid justify-center items-center pt-32 px-4 pb-32 gap-28">
      <div className="text-center grid gap-6 max-w-7xl mx-auto">
        <div>
          <Badge variant="outline">beta → 01 avr. → 🚀</Badge>
        </div>
        <h1 className="text-[66px]">
          Tu vis, on s’occupe des{" "}
          <strong className="bg-blue-400 px-5 py-0.5 rounded-2xl text-white inline-block text-[62px] align-top">
            chiffres
          </strong>
        </h1>
        <p>
          Grâce à la méthode 50/30/20, tu sais exactement où va ton argent et
          comment mieux le gérer !
        </p>
        <div className="flex gap-2 mx-auto">
          <Link
            href={ROUTES.SIGNIN}
            className={buttonVariants({ variant: "default" })}
          >
            <span className="font-bold">Commencer maintenant</span>
          </Link>
          <Button variant="outline">En savoir plus</Button>
        </div>
        <div className="mx-auto p-24">_</div>
      </div>
      <div className="text-center grid gap-5 max-w-3xl mx-auto">
        <div>
          <Badge variant="outline">fonctionnalités 💡</Badge>
        </div>
        <h2 className="text-5xl">Explore les super-pouvoirs de Trya</h2>
        <p className="max-w-xl mx-auto">
          Analyse automatique des dépenses, connexion bancaire sécurisée et bien
          plus encore : prends le contrôle de tes finances sans effort !
        </p>
      </div>
      <div className="grid grid-cols-2 gap-28 max-w-7xl mx-auto">
        <div className="grid gap-5">
          <h2 className="text-5xl">
            Connecte tes{" "}
            <strong className="bg-red-400 px-5 py-0.5 rounded-2xl text-white inline-block text-[44px] align-top">
              compte bancaire
            </strong>
          </h2>
          <p>
            Connecte automatiquement tes comptes bancaires pour suivre tes
            transactions en temps réel. Plus besoin de rentrer tes dépenses à la
            main.
          </p>
          <div className="flex gap-2">
            <Link
              href={ROUTES.SIGNIN}
              className={buttonVariants({ variant: "default" })}
            >
              <span className="font-bold">Commencer maintenant</span>
            </Link>
            <Button variant="outline">En savoir plus</Button>
          </div>
        </div>
        <div>_</div>
      </div>
      <div className="grid grid-cols-2 gap-28 max-w-7xl mx-auto">
        <div className="grid gap-5">
          <h2 className="text-5xl">
            Catégorisation de tes dépenses avec{" "}
            <strong className="bg-orange-400 px-5 py-0.5 rounded-2xl text-white inline-block text-[44px] align-top">
              openai
            </strong>
          </h2>
          <p>
            Grâce à l’intelligence artificielle, Trya analyse et classe
            automatiquement tes transactions dans les bonnes catégories. Plus
            besoin de deviner où va ton argent, tout est trié pour toi !
          </p>
          <div className="flex gap-2">
            <Link
              href={ROUTES.SIGNIN}
              className={buttonVariants({ variant: "default" })}
            >
              <span className="font-bold">Commencer maintenant</span>
            </Link>
            <Button variant="outline">En savoir plus</Button>
          </div>
        </div>
        <div>_</div>
      </div>
      <div className="grid grid-cols-2 gap-28 max-w-7xl mx-auto">
        <div className="grid gap-5">
          <h2 className="text-5xl">
            Gestion de ton budget avec la règle des{" "}
            <strong className="bg-yellow-400 px-5 py-0.5 rounded-2xl text-white inline-block text-[44px] align-top">
              50/30/20
            </strong>
          </h2>
          <p>
            Les dépenses varient selon les revenus : besoins, envies et épargne
            s’adaptent à chaque situation. L’essentiel ? Trouver un équilibre
            qui fonctionne pour vous.
          </p>
          <div className="flex gap-2">
            <Link
              href={ROUTES.SIGNIN}
              className={buttonVariants({ variant: "default" })}
            >
              <span className="font-bold">Commencer maintenant</span>
            </Link>
            <Button variant="outline">En savoir plus</Button>
          </div>
        </div>
        <div>_</div>
      </div>
    </section>
  );
}
