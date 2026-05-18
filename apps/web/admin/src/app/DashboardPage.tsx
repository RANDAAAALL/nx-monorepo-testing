import { useEffect, useState } from 'react';

export function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);

  // fetch data on mount
  useEffect(() => {
    const fetchUserData = async () => {
        const res = await fetch(`${import.meta.env.VITE_ADMIN_API_ME_URL}`, { credentials: 'include'});
        
        if(res.ok){
            const data = await res.json();
            setUsername(data.data.username);
            // console.log('User data fetched successfully:', data);
        } else { window.location.href = `${import.meta.env.VITE_ADMIN_NAVIGATE_TO_USER_LOGOUT_URL}` }
    };
    
    fetchUserData();
  },[]);

  const handleLogout = async () => { 
    try {
      await fetch(`${import.meta.env.VITE_ADMIN_API_LOGOUT_URL}`, { method: 'POST', credentials: 'include' });
    } catch (err: unknown) {
      console.error('Logout error', err instanceof Error ? err.message : err);
    }
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
