import { ArrowRightIcon, LandmarkIcon } from "lucide-react";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ROUTES } from "@/types/routes";

export const GlobalBalance = async () => {
  const user = await requiredCurrentUser();

  const userWithBankAccounts = await prisma.user.findUnique({
    where: { id: user.id },
    include: { items: { include: { bankAccounts: true } } },
  });

  const bankAccounts = userWithBankAccounts?.items.flatMap(
    (item) => item.bankAccounts
  );

  const totalBalance = bankAccounts?.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.balance || 0);
  }, 0);

  return (
    <div className="bg-white p-3 rounded-xl shadow-md grid gap-y-3">
      <div className="flex gap-2 items-center">
        <LandmarkIcon strokeWidth={3} />
        <span className="text-lg font-bold">Solde de vos comptes</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-6" />
        <Link href={ROUTES.ACCOUNTS} className="rounded-full">
          <div className="group/balance shadow-[0_0_6px_#47638840] py-2 pl-5 pr-2 bg-white flex gap-x-2.5 items-center rounded-full h-10">
            <span className="text-slate-600 font-extrabold text-xl">
              {totalBalance?.toFixed(2)} €
            </span>
            <div className="size-6 bg-slate-600 rounded-full flex items-center justify-center group-hover/balance:bg-green-400 transition-colors duration-300">
              <ArrowRightIcon
                width={14}
                height={14}
                strokeWidth={3}
                className="text-white"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
