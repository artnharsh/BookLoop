import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get('/api/admin/analytics'),
          axios.get('/api/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Admin fetch error:', error);
      }
    };
    fetchAdminData();
  }, [user]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure? This deletes the user and all their listings.')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  // Security check
  if (user?.role !== 'admin') return <Navigate to="/" />;

  return (
    <DashboardLayout>
      <div className="mt-4 flex flex-col gap-6">
        
        <h1 className="text-3xl font-bold px-2">Platform Admin</h1>

        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-light">
            <p className="text-sm text-gray-500 mb-2">Total Students</p>
            <p className="text-4xl font-black">{stats.totalUsers || 0}</p>
          </div>
          <div className="p-6 rounded-3xl glass-light">
            <p className="text-sm text-gray-500 mb-2">Active Listings</p>
            <p className="text-4xl font-black text-blue-500">{stats.activeListings || 0}</p>
          </div>
          <div className="p-6 rounded-3xl glass-light">
            <p className="text-sm text-gray-500 mb-2">Books Exchanged</p>
            <p className="text-4xl font-black text-brand-accent">{stats.soldListings || 0}</p>
          </div>
          <div className="p-6 rounded-3xl glass-light">
            <p className="text-sm text-gray-500 mb-2">Estimated Savings</p>
            <p className="text-4xl font-black text-green-500">{stats.estimatedPlatformSavings || '₹0'}</p>
          </div>
        </div>

        {/* User Management */}
        <div className="p-8 rounded-[2rem] glass-light flex-1">
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 font-medium text-gray-500">Name</th>
                  <th className="p-4 font-medium text-gray-500">Email</th>
                  <th className="p-4 font-medium text-gray-500">College</th>
                  <th className="p-4 font-medium text-gray-500">Role</th>
                  <th className="p-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-black/5 transition-colors">
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 text-sm">{u.college}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;