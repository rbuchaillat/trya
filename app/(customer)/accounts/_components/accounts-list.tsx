import Image from "next/image";
import Link from "next/link";
import {
  getAccountsByItemId,
  getItems,
  getProviderById,
} from "@/features/bridge/bridge.action";
import { ROUTES } from "@/types/routes";
import { cn } from "@/lib/utils";

export const AccountsList = async () => {
  const itemsResponse = await getItems();
  const items = itemsResponse?.data;

  if (!items) return null;

  return (
    <div className="grid gap-y-3">
      {items.resources.map(async (item) => {
        const providerResponse = await getProviderById({
          id: item.provider_id,
        });
        const provider = providerResponse?.data;

        const accountsResponse = await getAccountsByItemId({ id: item.id });
        const accounts = accountsResponse?.data;

        return (
          <div
            key={item.id}
            className="bg-white p-3 rounded-xl shadow-md grid gap-y-3"
          >
            {provider && (
              <div className="flex items-center gap-x-0.5">
                {provider.images && (
                  <Image
                    src={provider.images.logo}
                    width={36}
                    height={36}
                    alt={`${provider.group_name ?? provider.name} logo`}
                  />
                )}
                <p>{provider.group_name ?? provider.name}</p>
              </div>
            )}
            {accounts && (
              <div className="grid gap-y-2">
                {accounts.resources.map((account) => {
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
