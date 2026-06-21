'use client';

import { useEffect, useState } from 'react';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-25 dark:opacity-[0.12] hidden sm:block"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(200, 75, 17, 0.12), rgba(26, 58, 92, 0.06), transparent 80%)`,
      }}
    />
  );
}
