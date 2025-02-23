import { LandmarkIcon } from "lucide-react";
import { requiredCurrentUser } from "@/features/user/user.action";
import { prisma } from "@/lib/prisma";

export const BankAccountCounter = async () => {
  const user = await requiredCurrentUser();

  const userWithBankAccounts = await prisma.user.findUnique({
    where: { id: user.id },
    include: { items: { include: { bankAccounts: true } } },
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md grid gap-y-2">
      <div className="flex gap-2 items-center">
        <div className="bg-slate-100 p-1.5 rounded-md">
          <LandmarkIcon size={14} className="text-slate-500" />
        </div>
        <span className="text-slate-800 font-medium">
          Comptes bancaires connectés
        </span>
      </div>
      <div className="flex gap-2 items-center text-3xl font-semibold">
        {userWithBankAccounts?.items?.length}
      </div>
    </div>
  );
};
