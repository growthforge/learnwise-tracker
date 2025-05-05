
import * as React from "react";
import { create } from "zustand";

const MOBILE_BREAKPOINT = 768;

// Create a central state for mobile menu tracking
interface MobileMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useMobileMenu = () => {
  const { isOpen, open, close, toggle } = useMobileMenuStore();
  return { isOpen, open, close, toggle };
};

// Custom hook for detecting mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT;
    };
    
    // Initial check
    setIsMobile(checkMobile());
    
    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(checkMobile());
    };
    
    // Use different listener patterns based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(onChange);
    }
    
    // Clean up listener
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}

// Alias for more general media queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    
    const onChange = () => {
      setMatches(mql.matches);
    };
    
    // Initial check
    setMatches(mql.matches);
    
    // Use different listener patterns based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(onChange);
    }
    
    // Clean up listener
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange);
      }
    };
  }, [query]);

  return !!matches;
};
