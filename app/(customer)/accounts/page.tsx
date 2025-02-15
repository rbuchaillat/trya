import Image from "next/image";
import Link from "next/link";
import {
  getAccountsByItemId,
  getItems,
  getProviderById,
} from "@/features/bridge/bridge.action";
import { ROUTES } from "@/types/routes";
import { AddBankButton } from "./_components/add-bank-button";

export default async function BankAccounts() {
  const items = await getItems();

  return (
    <section>
      <h1>Accounts</h1>

      <div className="grid gap-y-6">
        {items?.data?.resources.map(async (item) => {
          const { data: provider } =
            (await getProviderById({
              id: item.provider_id,
            })) ?? {};

          const { data: accounts } =
            (await getAccountsByItemId({ id: item.id })) ?? {};

          return (
            <div className="grid gap-y-4 bg-gray-100 p-1" key={item.id}>
              {provider && (
                <div className="flex gap-y-0.5 items-center">
                  <Image
                    src={provider.images.logo}
                    width={36}
                    height={36}
                    alt={`${provider.group_name ?? provider.name} logo`}
                  />
                  <strong>{provider.group_name ?? provider.name}</strong>
                </div>
              )}

              <div className="grid gap-y-2">
                {accounts?.resources.map((account) => {
                  return (
                    <div key={account.id}>
                      <Link
                        href={`${ROUTES.ACCOUNTS}/${account.id}`}
                        className="hover:bg-green-200 p-2"
                      >
                        {account.name}: {account.balance}
                        {account.currency_code}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AddBankButton />
    </section>
  );
}
