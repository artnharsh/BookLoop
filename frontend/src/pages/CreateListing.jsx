import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/common/DashboardLayout';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '',
    courseCode: '',
    price: '',
    condition: 'Good',
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Must use FormData to send files alongside text data
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      await axios.post('/api/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/'); // Redirect to dashboard after successful post
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full p-8 rounded-[2rem] glass-light relative overflow-hidden shrink-0 mt-4">
        {/* Decorative ambient light */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="text-3xl font-bold mb-2">Sell a Book</h1>
        <p className="text-gray-500 mb-8">List your textbook for the community.</p>

        {error && <div className="p-4 mb-6 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Book Title *</label>
              <input name="title" type="text" required onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="e.g. Data Structures and Algorithms" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Author *</label>
              <input name="author" type="text" required onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="e.g. Thomas H. Cormen" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Course Code *</label>
              <input name="courseCode" type="text" required onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="e.g. CS201" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Edition (Optional)</label>
              <input name="edition" type="text" onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="e.g. 4th Edition" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Asking Price (₹) *</label>
              <input name="price" type="number" required min="0" onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Enter 0 to donate" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Condition *</label>
              <select name="condition" required onChange={handleChange} value={formData.condition}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all appearance-none">
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 pl-1">Upload Photos (Max 3)</label>
            <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-2xl bg-white/30 text-center hover:bg-white/50 transition-all cursor-pointer relative">
              <input type="file" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="text-gray-500">
                <span className="text-3xl block mb-2">📸</span>
                <p className="font-medium">Click or drag images here</p>
                <p className="text-xs mt-1">{images ? `${images.length} file(s) selected` : 'JPG, PNG up to 5MB'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading}
              className="px-8 py-4 font-bold rounded-2xl bg-brand-accent text-slate-950 hover:scale-[1.02] transition-transform disabled:opacity-50">
              {loading ? 'Posting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing;