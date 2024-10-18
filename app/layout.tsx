import "@/styles/globals.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decentrathon",
  description: "Decentrathon AI Track 'Perplexity Team'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
