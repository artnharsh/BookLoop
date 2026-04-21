import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ListingCard from '../components/listings/ListingCard';
import DashboardLayout from '../components/common/DashboardLayout';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const { data } = await axios.get('/api/listings');
        // Filter to show only books sold by the current user
        const filtered = data.filter(item => item.seller._id === user._id);
        setMyListings(filtered);
      } catch (error) {
        console.error('Error fetching profile listings');
      }
    };
    fetchMyListings();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Identity Bento Box */}
        <div className="p-8 rounded-[2rem] glass-light flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-brand-accent/20 flex items-center justify-center text-4xl mb-4">
            👤
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500 mb-4">{user.college}</p>
          <div className="w-full pt-4 border-t border-gray-200 mt-4">
             <p className="text-sm text-gray-500 mb-1">Email</p>
             <p className="font-medium">{user.email}</p>
          </div>
        </div>

        {/* My Listings Bento Box */}
        <div className="lg:col-span-2 p-8 rounded-[2rem] glass-light flex flex-col overflow-hidden">
          <h3 className="text-2xl font-bold mb-6">My Active Listings</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {myListings.map(listing => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                You haven't listed any books yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;