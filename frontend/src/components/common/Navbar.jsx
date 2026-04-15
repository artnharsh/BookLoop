import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto glass-light dark:glass-dark rounded-full px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-brand-accent">✦</span> BOOKLOOP
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/" className="text-sm font-medium hover:text-brand-accent transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="px-4 py-2 text-sm rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-brand-accent transition-colors">Log In</Link>
              <Link to="/register" className="px-5 py-2 text-sm font-medium rounded-full bg-gray-900 text-white dark:bg-slate-50 dark:text-slate-900 hover:scale-105 transition-transform">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;