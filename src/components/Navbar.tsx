import * as React from "react";
import { Search, Globe, User, Menu, ChevronDown, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Ride", href: "/" },
  { name: "Drive", href: "/" },
  { name: "Employee", href: "/employee", isSpecial: true },
  { name: "Wallet", href: "/wallet" },
  { name: "About", href: "/" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "glass-surface border-b" : "bg-black text-white px-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter">
              Uber
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2",
                    link.isSpecial && "text-blue-500"
                  )}
                >
                  {link.isSpecial && <Briefcase className="w-4 h-4" />}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 font-bold group">
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              EN
            </Button>
            <Button variant="ghost" size="sm" className="font-bold">Log in</Button>
            <Button size="sm" className={cn(
              "rounded-full px-6 font-bold shadow-lg luxury-shadow",
              isScrolled ? "bg-black text-white hover:bg-black/90" : "bg-white text-black hover:bg-white/90"
            )}>
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "rounded-full"
                )}
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] glass-card border-l-white/20">
                <nav className="flex flex-col gap-8 mt-16 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-3xl font-bold tracking-tighter hover:pl-2 transition-all flex items-center gap-4",
                        link.isSpecial && "text-blue-500"
                      )}
                    >
                      {link.isSpecial && <Briefcase className="w-8 h-8" />}
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-8 border-t border-black/10 flex flex-col gap-4">
                    <Button variant="outline" className="justify-start rounded-xl h-14 font-bold text-lg hover:bg-black/5">Log in</Button>
                    <Button className="justify-start rounded-xl h-14 font-bold text-lg shadow-lg hover:luxury-shadow">Sign up</Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
