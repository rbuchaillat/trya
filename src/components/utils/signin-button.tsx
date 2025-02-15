import { signInWithGoogleAction } from "@/features/user/user.action";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signInWithGoogleAction();
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
