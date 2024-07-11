'use client';

import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className="header bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Townwall</h1>
      </div>
      <button onClick={toggleTheme}>
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6 text-white" />
        ) : (
          <SunIcon className="h-6 w-6 text-white" />
        )}
      </button>
    </header>
  );
}
