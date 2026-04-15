import { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/listings/ListingCard';
import DashboardLayout from '../components/common/DashboardLayout';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get('/api/users/wishlist');
        setWishlist(data);
      } catch (error) {
        console.error('Error fetching wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full p-8 rounded-[2rem] glass-light dark:glass-dark mb-6 shrink-0 relative overflow-hidden mt-4">
         <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl"></div>
         <h1 className="text-3xl font-bold mb-2 relative z-10">Your Wishlist</h1>
         <p className="text-gray-500 dark:text-gray-400 relative z-10">Books you are keeping an eye on.</p>
      </div>

      <div className="flex-1 p-8 rounded-[2rem] glass-light dark:glass-dark overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
          </div>
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
            <span className="text-5xl mb-4 opacity-50">⭐</span>
            <p className="text-lg">Your wishlist is empty.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wishlist;