'use client';

import React, { useEffect, useState } from 'react';
import {
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';

interface HeaderProps {
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-orange-50 p-4 flex justify-between items-center z-50 mb-16 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Townwall</h1>
        <div className="flex items-center">
          <Link href="/search" passHref>
            <MagnifyingGlassIcon className="h-6 w-6 text-orange-50 hover:text-sky-500 mr-4 cursor-pointer" />
          </Link>
          {!!username && (
            <Link href={`/profile/${username}/private`} passHref>
              <HomeIcon className="mr-4 h-6 w-6 text-orange-50 hover:text-sky-500 cursor-pointer" />
            </Link>
          )}
          <button onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6 text-orange-50 hover:text-sky-500" />
            ) : (
              <SunIcon className="h-6 w-6 text-orange-50 hover:text-sky-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
