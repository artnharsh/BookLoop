import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-[#07111f] dark:via-[#08172a] dark:to-[#050b14]">
      <Navbar />
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/14 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md p-8 rounded-[2rem] glass-light dark:glass-dark">
          <h2 className="text-3xl font-bold mb-2 text-center">Join BookLoop</h2>
          <p className="text-center text-gray-500 dark:text-slate-400 mb-8">Create your trusted student account</p>
          
          {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 pl-2">Full Name</label>
              <input name="name" type="text" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="Alex Student" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 pl-2">College Domain Email (.edu/.ac.in/.org)</label>
              <input name="email" type="email" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="alex@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 pl-2">College Name</label>
              <input name="college" type="text" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="State University" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 pl-2">Password</label>
              <input name="password" type="password" onChange={handleChange} required minLength="6"
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 mt-6 font-bold rounded-2xl bg-gray-900 text-white dark:bg-slate-50 dark:text-slate-900 hover:scale-[1.02] transition-transform">
              Create Account
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-brand-accent font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;