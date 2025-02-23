import { EuroIcon } from "lucide-react";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";

export const Balance = async () => {
  const user = await requiredCurrentUser();

  const userWithBankAccounts = await prisma.user.findUnique({
    where: { id: user.id },
    include: { items: { include: { bankAccounts: true } } },
  });

  const bankAccounts = userWithBankAccounts?.items.flatMap(
    (item) => item.bankAccounts
  );

  const totalBalance = bankAccounts?.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.balance || 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md grid gap-y-2">
      <div className="flex gap-2 items-center">
        <div className="bg-slate-100 p-1.5 rounded-md">
          <EuroIcon size={14} className="text-slate-500" />
        </div>
        <span className="text-slate-800 font-medium">Solde de vos comptes</span>
      </div>
      <div className="flex gap-2 items-center text-3xl font-semibold">
        {totalBalance?.toFixed(2)} <span className="text-slate-300">€</span>
      </div>
    </div>
  );
};
