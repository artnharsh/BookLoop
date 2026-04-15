import { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/listings/ListingCard';
import DashboardLayout from '../components/common/DashboardLayout';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch listings on component mount and when search term changes
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axios.get(`/api/listings${search ? `?keyword=${search}` : ''}`);
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce to avoid spamming the API on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <DashboardLayout>
      
      {/* Bento Block 1: Search Header */}
      <div className="w-full p-8 rounded-[2rem] glass-light dark:glass-dark flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden shrink-0">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-accent/15 rounded-full blur-3xl"></div>
        
        <div className="z-10 w-full lg:w-1/2">
          <h1 className="text-4xl font-bold mb-2">Discover Textbooks</h1>
          <p className="text-gray-500 dark:text-slate-400">Find exactly what you need for this semester.</p>
        </div>
        
        <div className="z-10 w-full lg:w-1/2 flex gap-2">
          <input
            type="text"
            placeholder="Search by title, author, or course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Bento Block 2: The Grid */}
      <div className="flex-1 p-8 rounded-[2rem] glass-light dark:glass-dark overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-slate-400">
            <span className="text-5xl mb-4 opacity-50">📚</span>
            <p className="text-lg">No books found. Try adjusting your search!</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Home;