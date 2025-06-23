import { DeployButton } from "@/components/deploy-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import WabiSabiBackground from "@/components/wabi-sabi-background";
import { auth } from "@/auth";
import { doSignOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 统一的诧寂美学背景 */}
      <WabiSabiBackground />
      
      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>WaveShift</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Hey, {session.user.email}!</span>
                <form action={doSignOut}>
                  <Button type="submit" size="sm">Logout</Button>
                </form>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Next.js
            </a>
            {" & "}
            <a
              href="https://next-auth.js.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              NextAuth.js
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
        </div>
      </div>
    </main>
  );
}
