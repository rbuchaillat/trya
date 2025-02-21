"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { refreshBankAccounts } from "@/features/bridge/bridge.action";

export const RefreshButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      Promise.all([
        await refreshBankAccounts(),
        await new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      toast.success("Vos comptes ont été mis à jour avec succès");
    } catch (error) {
      console.error("Vos comptes n'ont pas été mis à jour", error);
      toast.error(
        "Une erreur est survenue. Vos comptes n'ont pas été mis à jour"
      );
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn("cursor-pointer group/refresh", {
        "animate-spin": loading,
      })}
    >
      <RefreshCwIcon
        width={16}
        height={16}
        className="text-slate-400 group-hover/refresh:text-slate-600"
      />
    </Button>
  );
};
