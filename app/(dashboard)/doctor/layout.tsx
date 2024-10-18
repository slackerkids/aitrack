import NavbarDoctor from "@/components/NavbarDoctor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <NavbarDoctor />
    <div className="pt-[60px]">
      {children}
    </div>
    </>
  );
}
