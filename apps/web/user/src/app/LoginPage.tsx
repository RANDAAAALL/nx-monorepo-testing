import { AuthForm } from '@org/shop-shared-ui';
import { useState } from 'react';

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: { user: string; pass: string }) => {
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API_LOGIN_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: data.user, password: data.pass }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login successful:', result);
        const token = result.data?.token;
        const redirectUrl = new URL(`${import.meta.env.VITE_USER_NAVIGATE_TO_ADMIN_LOGIN_URL}`);
        if (token) {
          redirectUrl.searchParams.set('token', token);
        }
        window.location.href = redirectUrl.toString();
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err: unknown) {
      console.error('Login error:', err instanceof Error ? err.message : err);
      setError('Login error: ' + (err instanceof Error ? err.message : err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AuthForm 
        type="login" 
        title="Sign in to your account" 
        onSubmit={handleLogin} 
        backLink='/'
      />
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg max-w-md w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
