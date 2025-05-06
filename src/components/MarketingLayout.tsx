
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap } from "lucide-react";

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>StudyFlow</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="default" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth?mode=login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>StudyFlow</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Your comprehensive study management platform
            </p>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        
        <div className="container py-4 px-4 md:px-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StudyFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
