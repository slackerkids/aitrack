"use client";

import NavbarClient from "@/components/NavbarClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    if (storedRole !== "patient" && typeof window !== "undefined") {
      router.replace("/"); 
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarClient />
      <div className="flex-1 pt-[60px] bg-gray-100 h-screen">
        {children}
      </div>
    </div>
  );
}
