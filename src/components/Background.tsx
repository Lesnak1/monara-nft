'use client';

import { useEffect, useState } from 'react';

export function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Monad purple overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-bounce-slow" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-full blur-3xl animate-spin-slow" />
      
      {/* Neural network pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #836EF9 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, #00D4AA 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }} />
    </div>
  );
} 