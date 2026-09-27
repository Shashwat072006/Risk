"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Accounts page — redirects to command-center with account360 tab
// The command-center SPA is the master hub for all views
export default function AccountsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/command-center?tab=account360");
  }, [router]);

  return (
    <div style={{
      background: "#070707",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#929292",
      fontSize: "0.6875rem",
      fontFamily: "monospace",
      letterSpacing: "0.1em",
    }}>
      Loading Accounts...
    </div>
  );
}
