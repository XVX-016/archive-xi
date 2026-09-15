import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type StaticPageLayoutProps = {
  activeNav?: "home" | "shop" | "about" | "contact";
  children: ReactNode;
};

export function StaticPageLayout({ activeNav, children }: StaticPageLayoutProps) {
  return (
    <main className="static-page min-h-screen bg-background text-foreground">
      <SiteHeader activeNav={activeNav} />
      {children}
      <SiteFooter />
    </main>
  );
}
