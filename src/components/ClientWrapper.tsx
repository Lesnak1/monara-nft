'use client';

import { useEffect, useState } from 'react';
import { Background } from './Background';
import MonadCursor from './MonadCursor';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Browser extension cleanup to prevent hydration issues
    const cleanupExtensionStyles = () => {
      const extensionStyles = document.querySelectorAll('style[class*="darkreader"], style[class*="extension"]');
      extensionStyles.forEach(style => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      });
    };

    // Run cleanup after a short delay to allow React hydration
    const timeoutId = setTimeout(cleanupExtensionStyles, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading MONARA...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MonadCursor />
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col text-white">
        {children}
      </div>
    </>
  );
} 