import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  // Construct the full image URL assuming your backend is on localhost:5000
  const imageUrl = listing.images && listing.images.length > 0
    ? `http://localhost:5000${listing.images[0]}`
    : 'https://via.placeholder.com/400x300?text=No+Photo';

  return (
    <div className="group flex flex-col justify-between rounded-[2rem] glass-light dark:glass-dark overflow-hidden hover:scale-[1.02] transition-all duration-300">
      
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
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">{listing.author}</p>
          <p className="inline-block px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs font-bold rounded-md mb-4">
            {listing.courseCode}
          </p>
        </div>
        
        {/* Footer Area */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-200 dark:border-white/10">
          <span className="text-2xl font-bold text-gray-900 dark:text-slate-50">
            {listing.price === 0 ? 'Donate' : `₹${listing.price}`}
          </span>
          <Link 
            to={`/listing/${listing._id}`} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white dark:bg-slate-50 dark:text-slate-900 hover:-translate-y-1 transition-transform"
          >
            ↗
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;