import { Button } from "@/components/ui/button";
import { deleteUser } from "@/features/bridge/bridge.action";

export default async function Dashboard() {
  return (
    <section className="p-4 flex flex-col gap-y-5">
      <h1>Paramètres</h1>
      <form
        action={async () => {
          "use server";
          await deleteUser();
        }}
      >
        <Button type="submit" variant="destructive">
          Supprimer le compte
        </Button>
      </form>
    </section>
  );
}
