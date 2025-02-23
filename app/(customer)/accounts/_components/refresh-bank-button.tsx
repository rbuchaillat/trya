"use client";

import { useEffect, useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshBankAccount } from "@/features/bridge/bridge.action";

export const RefreshBankButton = ({ itemId }: { itemId: number }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncToBridge = async () => {
      try {
        const item = await refreshBankAccount({ id: itemId });
        if (item?.data?.url) setUrl(item.data.url);
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
