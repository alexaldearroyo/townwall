import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import { cookies } from 'next/headers';
import { getSessionByToken } from '../../database/sessions';
import { getUserById } from '../../database/users';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Townwall',
  description: 'Connect with people locally',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session');

  let username = '';
  if (sessionToken) {
    const session = await getSessionByToken(sessionToken.value);
    if (session) {
      const user = await getUserById(session.userId);
      username = user.username;
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} pt-16`}>
        <Header username={username} />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
