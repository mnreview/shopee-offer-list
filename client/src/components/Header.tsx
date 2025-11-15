import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="px-4 md:px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.href ? (
                  <a href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>
        )}

        {/* Search Bar & Notifications */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Global search..."
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
