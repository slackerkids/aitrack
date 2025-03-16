import NavbarDoctor from "@/components/NavbarDoctor";
import DoctorSidebar from "@/components/DoctorDashboard/DoctorSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100 h-screen flex">
      {/* Sidebar слева */}
      <DoctorSidebar />

      {/* Основное содержимое занимает оставшееся место */}
      <div className="flex-1 overflow-auto h-full w-full">{children}</div>
    </div>
  );
}
