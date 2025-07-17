"use client";
import { useEffect } from 'react';

export default function MonadCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'monad-cursor';
    
    const dot = document.createElement('div');
    dot.className = 'monad-cursor-dot';
    
    const glow = document.createElement('div');
    glow.className = 'monad-cursor-glow';

    cursor.appendChild(dot);
    cursor.appendChild(glow);
    document.body.appendChild(cursor);

    const move = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      });
    };

    window.addEventListener('mousemove', move, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', move);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
} 