import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans p-6">
      <div className="w-full max-w-md">
        <header className="px-8 py-10 text-center">
          <h1 className="text-4xl font-extrabold text-black mb-2 tracking-tight">
            Welcome
          </h1>
        </header>

        <main className="px-8 flex flex-col gap-4">
          {[
            { id: 1, name: 'Login', path: '/login', style: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200' },
            { id: 2, name: 'Register', path: '/register', style: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm' },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full text-center text-lg font-semibold rounded-xl py-3.5 transition-all duration-300 ${item.style}`}
            >
              {item.name}
            </Link>
          ))}
        </main>
    
      </div>
    </div>
  );
}

export default LandingPage;
