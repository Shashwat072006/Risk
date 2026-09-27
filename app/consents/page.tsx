"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  useEffect(() => { router.replace("/command-center?tab=audit"); }, [router]);
  return <div style={{ background: "#070707", minHeight: "100vh" }} />;
}
