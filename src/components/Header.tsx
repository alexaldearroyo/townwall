// src/app/components/Header.tsx

'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center">
        <h1 className="text-white text-2xl font-bold">Townwall</h1>
      </div>
    </header>
  );
}
