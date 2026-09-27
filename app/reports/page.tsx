"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/command-center?tab=metrics");
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
      Loading Reports...
    </div>
  );
}
