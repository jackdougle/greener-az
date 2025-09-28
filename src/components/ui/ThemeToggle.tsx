import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('theme');
      if (val) return val === 'dark';
      // prefer system dark
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark(v => !v)}
      aria-label="Toggle theme"
      className={`rounded-md w-12 h-12 p-0 flex items-center justify-center
        ${isDark
          ? 'bg-pink-900 border-pink-700'
          : 'bg-pink-100 border-pink-300'
        }`}
    >
      {isDark ? (
        <Sun className="w-7 h-7 text-pink-300 scale-110" />
      ) : (
        <Sun className="w-7 h-7 text-pink-400 scale-110" />
      )}
    </Button>
  );
}
