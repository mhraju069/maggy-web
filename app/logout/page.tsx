import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signOut() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set("role", "", { path: "/", maxAge: 0 });
  redirect("/");
}

export default function LogoutPage() {
  return (
    <main className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Sign out</h1>
      <form action={signOut}>
        <button className="rounded-md bg-black px-5 py-3 text-sm font-semibold text-white">
          Confirm Sign Out
        </button>
      </form>
    </main>
  );
}
