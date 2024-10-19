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

    // Immediately redirect if the role is not "patient"
    if (storedRole !== "patient" && typeof window !== "undefined") {
      router.replace("/"); // Redirect to the homepage
    }
  }, [router]);

  return (
    <>
      <NavbarClient />
      <div className="pt-[60px] bg-gray-100">
        
        {children}
      </div>
    </>
  );
}
