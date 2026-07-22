import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import"./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Navbar } from "@/components/ui/navigation";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({children,}: Readonly<
  {children: React.ReactNode;}>) {
  return (
    <html lang="en"className=
    {cn("bg-zinc-50 font-sans dark:bg-black", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          </AuthProvider></body>
    </html>
  );
}
