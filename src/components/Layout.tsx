
import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion";
import AnimatedTransition from "./AnimatedTransition";
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar - fixed position with its own scrolling */}
      <div 
        className={`fixed z-40 h-full transition-all duration-300 ease-in-out
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  ${sidebarCollapsed ? 'w-[80px]' : 'w-64'}`}
      >
        <Sidebar />
        
        {/* Collapse button (desktop only) */}
        <div className="absolute top-4 -right-4 hidden md:block">
          <Button 
            size="icon" 
            variant="secondary" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="h-8 w-8 rounded-full shadow-md"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main content area - adjusted margin to account for fixed sidebar */}
      <main 
        className={`flex-1 transition-all duration-300 w-full min-h-screen
                   ${sidebarOpen && !sidebarCollapsed ? 'md:ml-64' : sidebarOpen && sidebarCollapsed ? 'md:ml-[80px]' : 'ml-0'}`}
      >
        <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <AnimatedTransition>
              {children}
            </AnimatedTransition>
          </AnimatePresence>
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
