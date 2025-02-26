"use client";

import { useEffect, useState } from "react";
import { requiredCurrentUser } from "@/features/user/user.action";
import {
  createUser,
  createConnectSession,
  getAccessToken,
} from "@/features/bridge/bridge.action";
import { Button } from "@/components/ui/button";

export const AddBankButton = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initToBridge = async () => {
      try {
        const user = await requiredCurrentUser();
        if (!user.bridgeId) await createUser(user.id);
        const accessToken = await getAccessToken(user.id);
        const item = await createConnectSession(user.email, accessToken);
        setUrl(item.url);
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

  if (!url) {
    return null;
  }

  return (
    <Button onClick={() => (window.location.href = url)} variant="default">
      Ajouter une banque
    </Button>
  );
};
