import { signOutAction } from "@/features/user/user.action";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOutAction();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
