import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListingCard = ({
  listing,
  currentUserId = null,
  enableWishlistAction = false,
  enableRemoveWishlistAction = false,
  onWishlistRemoved = () => {},
}) => {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  // Construct the full image URL assuming your backend is on localhost:5000
  const imageUrl = listing.images && listing.images.length > 0
    ? `http://localhost:5000${listing.images[0]}`
    : 'https://via.placeholder.com/400x300?text=No+Photo';

  const sellerId = typeof listing.seller === 'string' ? listing.seller : listing.seller?._id;
  const showWishlistButton = enableWishlistAction && currentUserId && sellerId && sellerId !== currentUserId;
  const showRemoveWishlistButton = enableRemoveWishlistAction;

  const handleAddToWishlist = async () => {
    if (isAddingToWishlist || wishlistAdded) {
      return;
    }

    try {
      setIsAddingToWishlist(true);
      await axios.post(`/api/users/wishlist/${listing._id}`);
      setWishlistAdded(true);
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not add to wishlist';
      alert(message);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (isRemovingFromWishlist) {
      return;
    }

    try {
      setIsRemovingFromWishlist(true);
      await axios.delete(`/api/users/wishlist/${listing._id}`);
      onWishlistRemoved(listing._id);
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not remove from wishlist';
      alert(message);
    } finally {
      setIsRemovingFromWishlist(false);
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-[2rem] glass-light overflow-hidden hover:scale-[1.02] transition-all duration-300">
      
      {/* Image Container with Floating Badge */}
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[1.5rem]">
        <img 
          src={imageUrl} 
          alt={listing.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-slate-950/70 backdrop-blur-md text-slate-100 border border-white/10">
          {listing.condition}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-bold line-clamp-1 mb-1">{listing.title}</h3>
          <p className="text-sm text-gray-500 mb-1">{listing.author}</p>
          <p className="inline-block px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs font-bold rounded-md mb-4">
            {listing.courseCode}
          </p>
        </div>
        
        {/* Footer Area */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {listing.price === 0 ? 'Donate' : `₹${listing.price}`}
          </span>

          <div className="flex items-center gap-2">
            {showWishlistButton && (
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist || wishlistAdded}
                className="px-3 h-10 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-accent hover:bg-brand-accent/25 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {wishlistAdded ? 'Wishlisted' : isAddingToWishlist ? 'Adding...' : '+ Wishlist'}
              </button>
            )}

            {showRemoveWishlistButton && (
              <button
                type="button"
                onClick={handleRemoveFromWishlist}
                disabled={isRemovingFromWishlist}
                className="px-3 h-10 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRemovingFromWishlist ? 'Removing...' : 'Remove'}
              </button>
            )}

            <Link 
              to={`/listing/${listing._id}`} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:-translate-y-1 transition-transform"
            >
              ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;