import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { SocialContext } from '../context/SocialContext';

export default function Navbar() {
  const { user, logoutUser } = useContext(SocialContext);
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-3 flex justify-between items-center max-w-full">
      <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">⚡ NEXUS</Link>
      <div className="flex gap-6 items-center font-medium">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Feed</Link>
        {user ? (
          <>
            <Link to={`/user/${user.username}`} className="text-gray-700 hover:text-blue-600 font-semibold">@{user.username}</Link>
            <button onClick={logoutUser} className="bg-gray-100 hover:bg-red-50 text-red-600 px-4 py-1.5 rounded-xl text-sm transition-colors cursor-pointer font-bold">Sign Out</button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-xl text-sm transition-colors font-bold">Join Nexus</Link>
        )}
      </div>
    </nav>
  );
}
