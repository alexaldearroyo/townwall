// src/app/(auth)/login/page.tsx

'use client';

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
