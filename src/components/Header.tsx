
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, 
  Menu, 
  Bell, 
  Settings, 
  ChevronDown,
  AlertCircle,
  LineChart,
  ShieldCheck,
  User
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  threatCount?: number;
}

export function Header({ threatCount = 0 }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "transition-colors hover:text-foreground/80";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div className="font-bold text-xl">Sentinel-AI</div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={isActive("/")}>Dashboard</Link>
            <Link to="/scan-history" className={isActive("/scan-history")}>Scans</Link>
            <Link to="/protection" className={isActive("/protection")}>Protection</Link>
            <Link to="/settings" className={isActive("/settings")}>Settings</Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {threatCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {threatCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {threatCount > 0 ? (
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate("/scan-history")}>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span>{threatCount} threats detected</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Options</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/protection")}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Protection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/scan-history")}>
                  <LineChart className="mr-2 h-4 w-4" />
                  Statistics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Help & Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-5 w-5" />
          {threatCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {threatCount}
            </span>
          )}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col divide-y">
            <Link to="/" className="px-4 py-3 hover:bg-muted transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/scan-history" className="px-4 py-3 hover:bg-muted transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Scans</Link>
            <Link to="/protection" className="px-4 py-3 hover:bg-muted transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Protection</Link>
            <Link to="/settings" className="px-4 py-3 hover:bg-muted transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
            {threatCount > 0 && (
              <Link to="/scan-history" className="px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>{threatCount} threats detected</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
