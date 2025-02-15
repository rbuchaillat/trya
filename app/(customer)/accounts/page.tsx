import Image from "next/image";
import { getAccessToken } from "@/features/bridge/bridge.utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import {
  getAccountsByItemId,
  getItems,
  getProviderById,
} from "@/features/bridge/bridge.action";
import { AddBankButton } from "./_components/add-bank-button";

export default async function BankAccounts() {
  const user = await requiredCurrentUser();
  const accessToken = await getAccessToken(user.id);
  const items = await getItems(accessToken);

  return (
    <section>
      <h1>Accounts</h1>

      <div className="grid gap-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.resources?.map(async (item: any) => {
          const provider = await getProviderById(item.provider_id, accessToken);
          const accounts = await getAccountsByItemId(item.id, accessToken);

          return (
            <div className="grid gap-y-1 bg-gray-100 p-1" key={item.id}>
              <div className="flex gap-y-0.5 items-center">
                <Image
                  src={provider.images.logo}
                  width={36}
                  height={36}
                  alt={`${provider.group_name ?? provider.name} logo`}
                />
                <strong>{provider.group_name ?? provider.name}</strong>
              </div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {accounts.resources?.map((account: any) => {
                return (
                  <div key={account.id}>
                    {account.name}: {account.balance}
                    {account.currency_code}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <AddBankButton />
    </section>
  );
}
