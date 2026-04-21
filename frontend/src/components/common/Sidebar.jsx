import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useContext(AuthContext);

  const links = [
    { name: 'Discover', path: '/', icon: '🔍' },
    { name: 'Sell a Book', path: '/create-listing', icon: '➕' },
    { name: 'Wishlist', path: '/wishlist', icon: '⭐' },
    { name: 'Messages', path: '/messages', icon: '💬' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  // Optional: Add Admin link if the user has the admin role
  if (user?.role === 'admin') {
    links.push({ name: 'Admin Panel', path: '/admin', icon: '🛡️' });
  }

  return (
    <aside className="w-64 h-[calc(100vh-2rem)] sticky top-4 flex-col justify-between p-6 rounded-[2rem] glass-light hidden md:flex">
      <div>
        <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900 flex items-center gap-2 mb-8">
          <span className="text-brand-accent">✦</span> BOOKLOOP
        </Link>
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === link.path 
                  ? 'bg-brand-accent/15 text-brand-accent font-semibold ring-1 ring-brand-accent/20' 
                  : 'hover:bg-black/5'
              }`}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium">
          <span>🚪</span> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;