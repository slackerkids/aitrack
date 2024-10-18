import "@/styles/globals.css"
import { Metadata } from "next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer/>
      </body>
    </html>
  );
}
