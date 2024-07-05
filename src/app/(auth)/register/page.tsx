// src/app/(auth)/register/page.tsx

'use client';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="main-content form-container bg-white dark:bg-gray-900">
      <RegisterForm />
    </div>
  );
}
