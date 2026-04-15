import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${id}`);
        setListing(data);
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleContactSeller = () => {
    // In Step 10, this will redirect to /messages with the receiverId pre-filled
    navigate(`/messages?listingId=${listing._id}&sellerId=${listing.seller._id}`);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    </DashboardLayout>
  );

  if (error || !listing) return (
    <DashboardLayout>
      <div className="flex-1 flex justify-center items-center text-xl text-gray-500">{error}</div>
    </DashboardLayout>
  );

  const isOwner = user._id === listing.seller._id;
  const imageUrl = listing.images && listing.images.length > 0
    ? `http://localhost:5000${listing.images[0]}`
    : 'https://via.placeholder.com/800x600?text=No+Photo';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto w-full p-6 lg:p-8 rounded-[2rem] glass-light dark:glass-dark mt-4 flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Image Gallery Area */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-black/10 dark:bg-slate-950/50 border border-gray-200 dark:border-white/10">
            <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          {listing.images?.length > 1 && (
            <div className="flex gap-4">
              {listing.images.slice(1).map((img, idx) => (
                <img key={idx} src={`http://localhost:5000${img}`} className="w-24 h-24 rounded-xl object-cover cursor-pointer hover:opacity-80 border border-gray-200 dark:border-white/10" alt={`View ${idx + 2}`} />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Action */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-accent/10 text-brand-accent text-sm font-bold rounded-lg mb-4">
              {listing.courseCode}
            </div>
            <h1 className="text-4xl font-extrabold mb-2 leading-tight">{listing.title}</h1>
            <p className="text-xl text-gray-500 dark:text-slate-400 mb-6">by {listing.author}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Condition</p>
                <p className="font-bold text-lg">{listing.condition}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Edition</p>
                <p className="font-bold text-lg">{listing.edition || 'N/A'}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/5 dark:bg-slate-950/45 border border-gray-200 dark:border-white/10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <p className="font-bold">{listing.seller.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{listing.seller.college}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-gray-200 dark:border-white/10 pt-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Asking Price</p>
              <p className="text-5xl font-black">
                {listing.price === 0 ? 'Donate' : `₹${listing.price}`}
              </p>
            </div>
            
            {!isOwner ? (
              <button 
                onClick={handleContactSeller}
                className="px-8 py-4 font-bold rounded-2xl bg-gray-900 text-white dark:bg-slate-50 dark:text-slate-900 hover:scale-[1.02] transition-transform"
              >
                Contact Seller
              </button>
            ) : (
              <div className="px-6 py-3 font-bold rounded-xl bg-gray-200 text-gray-500 dark:bg-slate-900/70 dark:text-slate-400 cursor-not-allowed">
                Your Listing
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookDetails;