import Image from "next/image";
import { ArrowLeftRightIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requiredCurrentUser } from "@/features/user/user.action";
import { formatDateWithDayAndShortMonth } from "@/utils/date";
import { cn } from "@/lib/utils";

export const LastTranslations = async () => {
  const user = await requiredCurrentUser();

  const transactions = await prisma.transaction.findMany({
    where: {
      bankAccount: { item: { user: { id: user.id } } },
    },
    include: {
      bankAccount: {
        include: {
          item: {
            select: {
              provider_images_logo: true,
            },
          },
        },
      },
    },
    orderBy: [{ date: "desc" }, { id: "asc" }],
    take: 5,
  });

  return (
    <div className="bg-white px-6 pt-6 pb-2 rounded-xl shadow-md grid gap-y-2">
      <div className="flex gap-2 items-center">
        <div className="bg-slate-100 p-1.5 rounded-md">
          <ArrowLeftRightIcon size={14} className="text-slate-500" />
        </div>
        <span className="text-slate-800 font-medium">
          Dernières transactions de vos comptes
        </span>
      </div>
      <table>
        <tbody className="text-xs">
          {transactions?.map((transaction) => {
            const date = new Date(transaction.date ?? 0);
            return (
              <tr
                key={transaction.id}
                className="h-10 border-b border-gray-100"
              >
                <td className="text-center w-10">
                  {transaction.bankAccount.item.provider_images_logo && (
                    <Image
                      src={transaction.bankAccount.item.provider_images_logo}
                      width={36}
                      height={36}
                      alt="Provider logo"
                    />
                  )}
                </td>
                <td className="text-center px-5 w-24">
                  <div>{formatDateWithDayAndShortMonth(date)}</div>
                  {date.getFullYear() !== new Date().getFullYear() && (
                    <div className="text-[8px]">{date.getFullYear()}</div>
                  )}
                </td>
                <td className="px-2.5 font-semibold">
                  {transaction.clean_description}
                </td>
                <td
                  className={cn("text-right px-2.5 font-bold w-24", {
                    "text-emerald-400": transaction.amount > 0,
                  })}
                >
                  {transaction.amount} €
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
