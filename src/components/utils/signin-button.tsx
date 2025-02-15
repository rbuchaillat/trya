import { PizzaIcon } from "lucide-react";
import { signInWithGoogleAction } from "@/features/user/user.action";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signInWithGoogleAction();
      }}
    >
      <Button type="submit" variant="outline">
        <PizzaIcon /> Google
      </Button>
    </form>
  );
}
