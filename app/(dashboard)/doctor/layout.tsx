"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarDoctor from "@/components/NavbarDoctor";
import DoctorSidebar from "@/components/DoctorDashboard/DoctorSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "doctor") {
      router.push("/login"); // Redirect non-doctors
    } else {
      setIsDoctor(true);
    }
  }, []);

  // Show nothing while checking role to prevent flashing
  if (isDoctor === null) {
    return <div className="h-screen flex items-center justify-center">Checking authorization...</div>;
  }

  return (
    <div className="bg-gray-100 h-screen flex">
      {/* Sidebar слева */}
      <DoctorSidebar />

      {/* Основное содержимое занимает оставшееся место */}
      <div className="flex-1 overflow-auto h-full w-full">{children}</div>
    </div>
  );
}
