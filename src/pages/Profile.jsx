import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SocialContext } from '../context/SocialContext';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const { user } = useContext(SocialContext);

  const fetchProfile = () => {
    axios.get(`http://localhost:5001/api/users/${username}`)
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchProfile(); }, [username]);

  const handleFollow = async () => {
    if (!user) return alert('Login required.');
    try {
      await axios.put(`http://localhost:5001/api/users/${profile._id}/follow`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchProfile();
    } catch (err) { console.log(err); }
  };

  if (!profile) return <div className="text-center py-20 text-gray-400 font-medium">Locating coordinates...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
        <div className="w-24 h-24 rounded-full bg-blue-600 text-white font-black text-3xl mx-auto flex items-center justify-center mb-4">
          {profile.username[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-black text-gray-950">@{profile.username}</h2>
        <p className="text-gray-400 text-sm mt-1 mb-4">{profile.email}</p>
        <p className="text-gray-700 max-w-md mx-auto leading-relaxed mb-6">{profile.bio}</p>
        
        <div className="flex justify-center gap-8 border-t border-b border-gray-100 py-4 mb-6">
          <div><span className="block font-black text-xl text-gray-900">{profile.followers?.length}</span><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Followers</span></div>
        </div>

        {user && user.username !== profile.username && (
          <button onClick={handleFollow} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-sm transition-colors text-sm cursor-pointer">
            {profile.followers?.includes(user._id) ? 'Unfollow' : 'Follow Network'}
          </button>
        )}
      </div>
    </div>
  );
}
