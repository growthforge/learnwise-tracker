
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Clock,
  CalendarClock,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  active 
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        active ? 
          "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : 
          "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/courses", label: "Courses", icon: <BookOpen className="w-5 h-5" /> },
    { path: "/tasks", label: "Tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { path: "/sessions", label: "Study Sessions", icon: <Clock className="w-5 h-5" /> },
    { path: "/schedule", label: "Schedule", icon: <CalendarClock className="w-5 h-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 flex flex-col py-4 border-r border-sidebar-border overflow-y-auto">
      <div className="px-6 py-4 mb-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">StudyFlow</h1>
        <p className="text-sidebar-foreground/70 text-sm mt-1">AI Study Planner</p>
      </div>
      
      <div className="space-y-1 px-3 mt-2 flex-1">
        {navItems.map((item) => (
          <SidebarLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
          />
        ))}
      </div>
      
      <div className="mt-auto px-6 py-4">
        <div className="bg-sidebar-accent rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft"></div>
            <p className="text-sm font-medium text-sidebar-foreground">AI Assistant</p>
          </div>
          <p className="text-xs text-sidebar-foreground/70">
            I've optimized your schedule based on upcoming deadlines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
