"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  Stethoscope,
  CalendarClock,
  Calendar,
  BarChartBig,
  LogOut,
  Menu,
  X,
  Leaf,
  MessageCircleMore,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"

interface NavbarClientProps {
  onLogout?: () => void;
  currentPath?: string;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, onClick, currentPath }) => {
  const isActive = currentPath === href;
  
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-all duration-300",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={onClick}
      >
        <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
        <span>{label}</span>
      </Link>
    </li>
  );
};

const NavbarClient: React.FC<NavbarClientProps> = ({ onLogout, currentPath = "" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    });

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out bg-white",
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/client" className="flex items-center">
              <div className="text-green-600 mr-2">
                <Leaf className="h-8 w-8" />
              </div>
              <h1 className="text-[25px] font-bold text-gray-800">HealHunter</h1>
            </Link>
          </div>

          <div className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <NavItem href="/client" icon={Home} label="Home" currentPath={currentPath} />
              <NavItem href="/client/appointment" icon={CalendarClock} label="Appointment" currentPath={currentPath} />
              <NavItem href="/client/diagnosis" icon={Stethoscope} label="Diagnosis" currentPath={currentPath} />
              <NavItem href="/client/chat" icon={MessageCircleMore} label="Chat" currentPath={currentPath} />
              <NavItem href="/client/analysis" icon={BarChartBig} label="Analysis" currentPath={currentPath} />
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogOut}
              className="hidden md:flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm md:hidden z-50">
          <div className="container h-full p-6">
            <div className="flex justify-end mb-6">
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X size={24} className="text-foreground" />
              </Button>
            </div>

            <ul className="flex flex-col space-y-5 mt-4">
              <NavItem href="/client" icon={Home} label="Home" onClick={closeMobileMenu} currentPath={currentPath} />
              <NavItem href="/client/diagnosis" icon={Stethoscope} label="Diagnosis" onClick={closeMobileMenu} currentPath={currentPath} />
              <NavItem href="/client/appointment" icon={CalendarClock} label="Appointment" onClick={closeMobileMenu} currentPath={currentPath} />
              <NavItem href="/client/calendar" icon={Calendar} label="Calendar" onClick={closeMobileMenu} currentPath={currentPath} />
              <NavItem href="/client/analysis" icon={BarChartBig} label="Analysis" onClick={closeMobileMenu} currentPath={currentPath} />
            </ul>

            <div className="mt-8">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogOut}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarClient;