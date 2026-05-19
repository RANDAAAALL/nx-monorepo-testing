import { useEffect, useState } from 'react';

export function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);

  // fetch data on mount
  useEffect(() => {
    // Check URL for token passed from the login app across domains
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('auth_token', tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('auth_token');

    const fetchUserData = async () => {
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${import.meta.env.VITE_ADMIN_API_ME_URL}`, { 
          headers,
          credentials: 'include'
        });
        
        if(res.ok){
            const data = await res.json();
            setUsername(data.data.username);
            // console.log('User data fetched successfully:', data);
        } else { 
            localStorage.removeItem('auth_token');
            window.location.href = `${import.meta.env.VITE_ADMIN_NAVIGATE_TO_USER_LOGOUT_URL}` 
        }
    };
    
    fetchUserData();
  },[]);

  const handleLogout = async () => { 
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${import.meta.env.VITE_ADMIN_API_LOGOUT_URL}`, { 
        method: 'POST', 
        headers,
        credentials: 'include' 
      });
    } catch (err: unknown) {
      console.error('Logout error', err instanceof Error ? err.message : err);
    }
    localStorage.removeItem('auth_token');
    window.location.href = `${import.meta.env.VITE_ADMIN_NAVIGATE_TO_USER_LOGOUT_URL}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans p-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        
        <p className="mt-4 text-xl text-gray-600 font-medium">
          Welcome back, <span className="text-blue-600 font-bold capitalize">{username || 'Guest'}</span>!
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>
  );
}

export default DashboardPage;
