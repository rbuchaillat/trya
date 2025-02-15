"use client";

import {
  createConnectSession,
  createUser,
} from "@/features/bridge/bridge.action";
import { getAccessToken } from "@/features/bridge/bridge.utils";
import { requiredCurrentUser } from "@/features/user/user.action";
import { useEffect, useState } from "react";

export const AddBankButton = () => {
  const [bridgeUrl, setBridgeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initToBridge = async () => {
      try {
        const user = await requiredCurrentUser();
        if (!user?.isCreatedOnBridge) await createUser(user.id);
        const accessToken = await getAccessToken(user.id);
        const item = await createConnectSession(accessToken, user.email);
        setBridgeUrl(item.url);
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
