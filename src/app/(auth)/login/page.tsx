// src/app/(auth)/login/page.tsx

'use client';

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="main-content form-container bg-white dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
