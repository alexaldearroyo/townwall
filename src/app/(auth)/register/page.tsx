// src/app/(auth)/register/page.tsx

'use client';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <RegisterForm />
    </div>
  );
}
