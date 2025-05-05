
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useMobileMenu } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  BookText,
  Calendar,
  CheckSquare,
  Clock,
  GraduationCap,
  Home,
  LogOut,
  Settings,
} from "lucide-react";

const links = [
  { path: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { path: "/courses", label: "Courses", icon: <GraduationCap size={18} /> },
  { path: "/tasks", label: "Tasks", icon: <CheckSquare size={18} /> },
  { path: "/schedule", label: "Schedule", icon: <Calendar size={18} /> },
  { path: "/sessions", label: "Study Sessions", icon: <Clock size={18} /> },
  { path: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { path: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { close } = useMobileMenu();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <aside className="relative flex w-full flex-col border-r bg-card pb-6">
      <div className="flex h-14 items-center px-4 border-b">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
          <BookText className="h-5 w-5 text-primary" />
          <span>StudyFlow</span>
        </NavLink>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="px-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-medium text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
