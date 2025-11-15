import { useState } from "react";
import { Menu, X, Home, Bookmark, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: Bookmark, label: "Saved Items", href: "/saved", active: false },
    { icon: FileText, label: "Export History", href: "/exports", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo Area */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={APP_LOGO} alt="AffiliatePro" className="w-10 h-10 rounded" />
          <div className="font-bold text-lg">AffiliatePro</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">John Doe</div>
            <div className="text-xs text-sidebar-foreground opacity-75 truncate">
              john@example.com
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-sidebar border-r border-sidebar-border">
        {sidebarContent}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-background border border-border"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-64 z-40 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
