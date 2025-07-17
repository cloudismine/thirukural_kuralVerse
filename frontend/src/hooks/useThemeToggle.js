import { useState, useEffect } from 'react';

export const useThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('kuralverse-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('kuralverse-theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme };
};
