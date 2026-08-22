"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Sprout,
  UserCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

type NavbarProps = {
  children: ReactNode;
};

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/transaction",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    href: "/report",
    label: "Reports",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle,
  },
];

export function Navbar({ children }: NavbarProps) {
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not show dashboard navigation before login.
  if (!isLoggedIn) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {/* Desktop left sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-white md:flex">
        <Link
          href="/dashboard"
          className="flex h-20 items-center gap-3 border-b px-6 text-xl font-bold text-green-700"
        >
          <Sprout size={26} />
          Agri Tracker
        </Link>

        <nav className="flex-1 space-y-2 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={logout}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile top navigation */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-green-700"
        >
          <Sprout size={22} />
          Agri Tracker
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </header>

      {/* Mobile dropdown links */}
      {mobileMenuOpen && (
        <nav className="border-b bg-white p-3 md:hidden">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}

            <Button
              variant="outline"
              className="mt-2 w-full justify-start gap-3"
              onClick={logout}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </nav>
      )}

      {/* Dashboard page content */}
      <main className="min-h-screen bg-zinc-50 md:ml-64">{children}</main>
    </>
  );
}