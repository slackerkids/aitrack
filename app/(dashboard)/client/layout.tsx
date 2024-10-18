import NavbarClient from "@/components/NavbarClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <NavbarClient />
    <div className="pt-[60px]">
      {children}
    </div>
    </>
  );
}
