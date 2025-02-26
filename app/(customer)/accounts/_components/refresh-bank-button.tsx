"use client";

import { useEffect, useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAccessToken,
  refreshBankAccount,
} from "@/features/bridge/bridge.action";
import { requiredCurrentUser } from "@/features/user/user.action";

export const RefreshBankButton = ({ itemId }: { itemId: number }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncToBridge = async () => {
      try {
        const user = await requiredCurrentUser();
        const accessToken = await getAccessToken(user.id);
        const item = await refreshBankAccount(itemId, accessToken);
        setUrl(item.url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    syncToBridge();
  }, [itemId]);

  if (loading) {
    return <p>...</p>;
  }

  if (!url) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => (window.location.href = url)}
      className="group/refresh"
    >
      <RefreshCwIcon className="text-slate-600" />
    </Button>
  );
};
