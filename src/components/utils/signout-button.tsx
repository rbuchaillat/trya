import { signOutAction } from "@/features/user/user.action";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOutAction();
      }}
    >
      <Button type="submit" variant="link">
        Se déconnecter
      </Button>
    </form>
  );
}
