import Image from "next/image";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/types/routes";
import { requiredCurrentUser } from "@/features/user/user.action";
import { deleteItem } from "@/features/bridge/bridge.action";
import { Button } from "@/components/ui/button";

export const AccountsList = async () => {
  const user = await requiredCurrentUser();

  if (!user.bridgeId) return null;

  const items = await prisma.item.findMany({
    where: { userId: user.bridgeId },
    include: { bankAccounts: true },
  });

  if (!items) return null;

  return (
    <div className="grid gap-y-3">
      {items.map(async (item) => {
        return (
          <div
            key={item.id}
            className="bg-white p-3 rounded-xl shadow-md grid gap-y-3"
          >
            <div className="flex justify-between items-center">
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
                  <p className="font-bold">
                    {item.provider_group_name ?? item.provider_name}
                  </p>
                </div>
              )}
              <form
                action={async () => {
                  "use server";
                  await deleteItem({ id: item.id });
                }}
              >
                <Button type="submit" variant="outline" size="icon">
                  <Trash2Icon />
                </Button>
              </form>
            </div>
            {item.bankAccounts && (
              <div className="grid gap-y-2">
                {item.bankAccounts.map((account) => {
                  return (
                    <div key={account.id}>
                      <Link href={`${ROUTES.ACCOUNTS}/${account.id}`}>
                        <div className="border rounded-md p-3 flex justify-between items-center hover:bg-slate-100 group/account">
                          <span className="font-semibold group-hover/account:font-bold">
                            {account.name}
                          </span>
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
