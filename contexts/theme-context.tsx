'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, type ThemeName, type Theme } from '@/lib/themes';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeName;
  mode: ThemeMode;
  currentTheme: Theme;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('wiillow');
  const [mode, setModeState] = useState<ThemeMode>('light');

  // Apply CSS variables whenever theme or mode changes
  useEffect(() => {
    const currentTheme = themes[theme];
    const root = document.documentElement;

    // Apply all theme colors as CSS variables
    Object.entries(currentTheme.colors).forEach(([colorName, colorValue]) => {
      const cssVarName = `--${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, colorValue[mode]);
    });

    // Set dark class for compatibility
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mode]);

  // Load saved theme and mode from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    const savedMode = localStorage.getItem('mode') as ThemeMode;
    
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
    
    if (savedMode) {
      setModeState(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('mode', newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    mode,
    currentTheme: themes[theme],
    setTheme,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}