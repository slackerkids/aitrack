import React, { useState, useEffect } from "react";
import { NavLink, BrowserRouter } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Stethoscope,
  CalendarClock,
  Calendar,
  BarChartBig,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NavbarClientProps {
  onLogout?: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "navbar-link flex items-center gap-2 text-sm font-medium transition-all duration-300",
          isActive
            ? "text-primary active"
            : "text-muted-foreground hover:text-foreground",
        )
      }
      onClick={onClick}
    >
      <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
      <span>{label}</span>
    </NavLink>
  </li>
);

const NavbarClient: React.FC<NavbarClientProps> = ({ onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");

    // Show toast notification
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    });

    // Call the onLogout prop if provided
    if (onLogout) {
      onLogout();
    } else {
      // Default fallback - navigate to home
      window.location.href = "/";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <BrowserRouter>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <NavLink to="/client" className="flex items-center">
                <span className="btn btn-ghost text-3xl font-bold tracking-tight bg-gradient-to-tr from-green-400 via-green-300 to-green-500 text-transparent bg-clip-text">
                  HealHunter Patient
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <ul className="flex space-x-6 items-center">
                <NavItem to="/client" icon={Home} label="Home" />
                <NavItem to="/client/diagnosis" icon={Stethoscope} label="Diagnosis" />
                <NavItem
                  to="/client/appointment"
                  icon={CalendarClock}
                  label="Appointment"
                />
                <NavItem to="/client/calendar" icon={Calendar} label="Calendar" />
                <NavItem to="/client/analysis" icon={BarChartBig} label="Analysis" />
              </ul>
            </div>

            {/* Logout Button and Mobile Menu Trigger */}
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
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <div className="mobile-menu-container">
            <div className="flex justify-end mb-6">
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X size={24} className="text-foreground" />
              </Button>
            </div>

            <ul className="flex flex-col space-y-5 mt-4">
              <NavItem to="/client" icon={Home} label="Home" onClick={closeMobileMenu} />
              <NavItem
                to="/client/diagnosis"
                icon={Stethoscope}
                label="Diagnosis"
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/client/appointment"
                icon={CalendarClock}
                label="Appointment"
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/client/calendar"
                icon={Calendar}
                label="Calendar"
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/client/analysis"
                icon={BarChartBig}
                label="Analysis"
                onClick={closeMobileMenu}
              />
            </ul>

            <div className="mt-auto">
              <Button
                variant="destructive"
                className="w-full mt-6 flex items-center justify-center gap-2"
                onClick={handleLogOut}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default NavbarClient;
