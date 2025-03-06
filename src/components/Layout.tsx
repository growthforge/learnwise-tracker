
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion";
import AnimatedTransition from "./AnimatedTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container py-8 px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <AnimatedTransition>
              {children}
            </AnimatedTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
