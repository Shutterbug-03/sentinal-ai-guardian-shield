
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Menu, 
  Bell, 
  Settings, 
  ChevronDown,
  AlertCircle
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

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div className="font-bold text-xl">Sentinel-AI</div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="transition-colors hover:text-foreground/80">Dashboard</a>
            <a href="#" className="transition-colors hover:text-foreground/80">Scans</a>
            <a href="#" className="transition-colors hover:text-foreground/80">Protection</a>
            <a href="#" className="transition-colors hover:text-foreground/80">Settings</a>
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
                  <DropdownMenuItem className="flex items-center gap-2">
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Update Database</DropdownMenuItem>
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
            <a href="#" className="px-4 py-3 hover:bg-muted transition-colors">Dashboard</a>
            <a href="#" className="px-4 py-3 hover:bg-muted transition-colors">Scans</a>
            <a href="#" className="px-4 py-3 hover:bg-muted transition-colors">Protection</a>
            <a href="#" className="px-4 py-3 hover:bg-muted transition-colors">Settings</a>
            {threatCount > 0 && (
              <a href="#" className="px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>{threatCount} threats detected</span>
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
