import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { requiredCurrentUser } from "@/features/user/user.action";

export const AccountInfo = async (props: { id: string }) => {
  const { id } = props;

  const user = await requiredCurrentUser();

  const userWithBankAccount = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      items: {
        include: {
          bankAccounts: {
            where: { id: id },
          },
        },
      },
    },
  });

  const bankAccount = userWithBankAccount?.items
    .flatMap((item) => item.bankAccounts)
    .find((bankAccount) => bankAccount.id === id);

  if (!bankAccount) return null;

  return (
    <div className="bg-white rounded-xl shadow-md text-center p-2">
      <strong
        className={cn({
          "text-emerald-400": bankAccount.balance >= 0,
          "text-red-500": bankAccount.balance < 0,
        })}
      >
        {bankAccount.balance} €
      </strong>
      <div>
        <strong className="text-xs text-slate-400">{bankAccount.name}</strong>
      </div>
    </div>
  );
};
