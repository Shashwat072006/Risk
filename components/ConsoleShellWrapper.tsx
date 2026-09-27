"use client";
import { usePathname } from "next/navigation";
import ConsoleShell from "./ConsoleShell";

// Pages that use the marketing/landing layout (no sidebar)
const LANDING_ROUTES = ["/"];

export default function ConsoleShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isLanding = LANDING_ROUTES.includes(pathname);

  if (isLanding) {
    // Landing page: no sidebar, full-width
    return <>{children}</>;
  }

  // Console pages: persistent sidebar
  return <ConsoleShell>{children}</ConsoleShell>;
}
