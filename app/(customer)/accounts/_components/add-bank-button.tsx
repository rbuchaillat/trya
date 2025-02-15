"use client";

import { useEffect, useState } from "react";
import {
  createUser,
  createConnectSession,
} from "@/features/bridge/bridge.action";
import { requiredCurrentUser } from "@/features/user/user.action";

export const AddBankButton = () => {
  const [bridgeUrl, setBridgeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initToBridge = async () => {
      try {
        const user = await requiredCurrentUser();
        if (!user?.isCreatedOnBridge) await createUser();
        const item = await createConnectSession();
        if (item?.data?.url) setBridgeUrl(item.data.url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initToBridge();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!bridgeUrl) {
    return null;
  }

  return (
    <button onClick={() => (window.location.href = bridgeUrl)}>
      Ajouter une banque
    </button>
  );
};
