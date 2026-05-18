import { AuthForm } from '@org/shop-shared-ui';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: { user: string; pass: string }) => {
    setError(null); 

    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API_REGISTER_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.user, password: data.pass }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Registration successful:', result);        
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err instanceof Error ? err.message : err);
      setError('Registration error: ' + (err instanceof Error ? err.message : err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AuthForm 
        type="register" 
        title="Create New Account" 
        onSubmit={handleRegister}
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

export default RegisterPage;
