
import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion";
import AnimatedTransition from "./AnimatedTransition";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background relative">
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

      {/* Sidebar - hidden on mobile by default */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       fixed md:relative z-40 transition-transform duration-300 md:translate-x-0`}>
        <Sidebar />
      </div>

      {/* Main content area - full width on mobile, with sidebar space on desktop */}
      <main className={`flex-1 transition-all duration-300 w-full 
                        ${sidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <AnimatedTransition>
              {children}
            </AnimatedTransition>
          </AnimatePresence>
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
