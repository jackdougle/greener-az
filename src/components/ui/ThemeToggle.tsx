import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

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
        <button
            onClick={() => setIsDark(v => !v)}
            aria-label="Toggle theme"
            className="flex items-center justify-center px-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-popover hover:text-foreground"
        >
            {isDark ? (
                <Sun className="w-7 h-7 text-pink-800" />
            ) : (
                <Moon className="w-7 h-7 text-green-500" />
            )}
        </button>
    );
}