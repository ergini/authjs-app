import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return (
    <div>
      <Link href="/sign-in">
        Sign in
      </Link>
    </div>
  )
  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
