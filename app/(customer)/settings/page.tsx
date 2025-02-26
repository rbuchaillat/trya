import { Button } from "@/components/ui/button";
import { deleteUser, getAccessToken } from "@/features/bridge/bridge.action";
import { requiredCurrentUser } from "@/features/user/user.action";

export default async function Dashboard() {
  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>Paramètres</h1>
      <form
        action={async () => {
          "use server";
          const user = await requiredCurrentUser();
          const accessToken = await getAccessToken(user.id);
          if (user.bridgeId)
            await deleteUser(user.id, user.bridgeId, accessToken);
        }}
      >
        <Button type="submit" variant="destructive">
          Supprimer le compte
        </Button>
      </form>
    </section>
  );
}
