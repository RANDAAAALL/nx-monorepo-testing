import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthFormProps } from '@org/models';

export function AuthForm({ type, onSubmit, title, backLink}: AuthFormProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ user, pass });
  };

  return (
    <div className="w-full max-w-md p-8 relative">
      <Link 
        to={backLink as string} 
        className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </Link>

      <div className="text-center mt-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">
          {type === 'login' 
            ? 'Welcome back! Please enter your details.' 
            : 'Create an account to get started.'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser((e.target as HTMLInputElement).value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass((e.target as HTMLInputElement).value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          {type === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
