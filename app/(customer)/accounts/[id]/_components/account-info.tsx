import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const AccountInfo = async (props: { id: number }) => {
  const { id } = props;

  const account = await prisma.bankAccount.findUnique({ where: { id } });

  if (!account) return null;

  return (
    <div className="bg-white rounded-xl shadow-md text-center p-2">
      <strong
        className={cn({
          "text-emerald-400": account.balance >= 0,
          "text-red-500": account.balance < 0,
        })}
      >
        {account.balance} €
      </strong>
      <div>
        <strong className="text-xs text-slate-400">{account.name}</strong>
      </div>
    </div>
  );
};
