"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");
  
  // Wait until component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to determine actual theme (resolving system preference)
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === "system") {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Direct theme setting
      setCurrentTheme(theme as "light" | "dark");
    }
  }, [theme, mounted]);

  // Toggle between light and dark, preserving system preference
  const toggleTheme = () => {
    if (theme === "system") {
      // If currently using system preference, switch away from it
      setTheme(currentTheme === "dark" ? "light" : "dark");
    } else {
      // If using explicit setting, toggle it
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="theme-toggle-placeholder" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {currentTheme === "dark" ? (
        <Sun className="theme-icon" />
      ) : (
        <Moon className="theme-icon" />
      )}
    </button>
  );
} 