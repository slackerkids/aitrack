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
    <div>
      <NavbarClient />
      <div className=" v-[100%] h-[100%] ">
        {children}
      </div>
    </div>
  );
}
