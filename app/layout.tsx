import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ConsoleShellWrapper from "@/components/ConsoleShellWrapper";

export const metadata: Metadata = {
  title: "ATDP — Financial Risk Operating System",
  description:
    "Bank-oriented financial-risk operating system. Account 360, transaction intelligence, behavioral baseline, entity graph, adaptive decisioning, and audit trail.",
  keywords: ["fraud detection", "financial risk", "bank security", "transaction intelligence", "adaptive decisioning"],
  openGraph: {
    title: "ATDP — Financial Risk Operating System",
    description: "Account 360 · Behavioral Intelligence · Adaptive Decisioning · Audit Trail",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScroll>
          <div className="grain-overlay" aria-hidden="true" />
          <ConsoleShellWrapper>
            {children}
          </ConsoleShellWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
