import NavbarDoctor from "@/components/NavbarDoctor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <NavbarDoctor />
    <div className="pt-[60px] bg-gray-100 h-screen">
      {children}
    </div>
    </>
  );
}

