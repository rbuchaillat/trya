import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton } from "@/components/utils/signin-button";
import { ROUTES } from "@/types/routes";

export default async function Signup() {
  return (
    <div className="h-screen flex">
      <section className="basis-1/3 flex flex-col justify-center items-center gap-y-4">
        <h1 className="text-2xl">Inscription</h1>
        <SignInButton />
        <Link
          href={ROUTES.SIGNIN}
          className={buttonVariants({ variant: "link" })}
        >
          <ChevronRightIcon /> Se connecter
        </Link>
      </section>
      <div className="basis-2/3 bg-linear-65 from-purple-500 to-pink-500" />
    </div>
  );
}
