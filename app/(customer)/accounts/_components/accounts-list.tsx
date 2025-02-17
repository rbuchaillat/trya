import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/types/routes";
import { requiredCurrentUser } from "@/features/user/user.action";

export const AccountsList = async () => {
  const user = await requiredCurrentUser();

  if (!user.bridgeId) return null;

  const items = await prisma.item.findMany({
    where: { userId: user.bridgeId },
  });

  if (!items) return null;

  return (
    <div className="grid gap-y-3">
      {items.map(async (item) => {
        const accounts = await prisma.bankAccount.findMany({
          where: { item_id: +item.id.toString() },
        });

        return (
          <div
            key={item.id}
            className="bg-white p-3 rounded-xl shadow-md grid gap-y-3"
          >
            {(item.provider_group_name || item.provider_name) && (
              <div className="flex items-center gap-x-0.5">
                {item.provider_images_logo && (
                  <Image
                    src={item.provider_images_logo}
                    width={36}
                    height={36}
                    alt={`${
                      item.provider_group_name ?? item.provider_name
                    } logo`}
                  />
                )}
                <p>{item.provider_group_name ?? item.provider_name}</p>
              </div>
            )}
            {accounts && (
              <div className="grid gap-y-2">
                {accounts.map((account) => {
                  return (
                    <div key={account.id}>
                      <Link href={`${ROUTES.ACCOUNTS}/${account.id}`}>
                        <div className="border rounded-md p-3 flex justify-between items-center">
                          <span>{account.name}</span>
                          <strong
                            className={cn({
                              "text-emerald-400": account.balance >= 0,
                              "text-red-500": account.balance < 0,
                            })}
                          >
                            {account.balance} €
                          </strong>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
