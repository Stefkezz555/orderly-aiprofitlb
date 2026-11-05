import { Suspense } from "react";

// Clerk komponente čitaju adresu (usePathname); sa Cache Components to mora biti u <Suspense>.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Suspense>{children}</Suspense>
    </main>
  );
}
