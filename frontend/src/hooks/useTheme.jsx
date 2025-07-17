import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('tamil'); // Default to Tamil

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('kuralverse_theme');
    const savedLanguage = localStorage.getItem('kuralverse_language');

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Default to Tamil if no saved preference
      setLanguage('tamil');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('kuralverse_theme', theme);
  }, [theme]);

  // Apply language preference
  useEffect(() => {
    localStorage.setItem('kuralverse_language', language);
    document.documentElement.lang = language === 'tamil' ? 'ta' : 'en';
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => {
    setTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'english' ? 'tamil' : 'english');
  };

  const setEnglish = () => {
    setLanguage('english');
  };

  const setTamil = () => {
    setLanguage('tamil');
  };

  const isDark = theme === 'dark';
  const isTamil = language === 'tamil';

  const value = {
    theme,
    language,
    isDark,
    isTamil,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    toggleLanguage,
    setEnglish,
    setTamil,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
