import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('socialUser')) || null);
  
  const login = (userData) => {
    localStorage.setItem('socialUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('socialUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          {/* Top Sticky Header */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-3 flex justify-between items-center shadow-xs">
            <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">⚡ NEXUS</Link>
            <div className="flex gap-6 items-center font-medium">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Timeline</Link>
              {user ? (
                <>
                  <Link to={`/user/${user.username}`} className="text-gray-900 font-bold hover:underline">@{user.username}</Link>
                  <button onClick={logout} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-xl text-sm font-bold transition-colors">Join Nexus</Link>
              )}
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/user/:username" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

// --- CORE INTERACTIVE VIEW COMPONENTS ---
function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const loadFeed = () => {
    axios.get('http://localhost:5001/api/posts').then(res => setPosts(res.data));
  };

  useEffect(() => { loadFeed(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post('http://localhost:5001/api/posts', { content }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setContent('');
      loadFeed();
    } catch (err) { alert('Session validation expired'); }
  };

  const handleLike = async (id) => {
    if (!user) return alert('Login required to like posts.');
    try {
      await axios.put(`http://localhost:5001/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      loadFeed();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {user && (
        <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <textarea className="w-full border-0 focus:outline-hidden resize-none text-lg text-gray-800 placeholder-gray-400" rows="3" placeholder="Share what's happening..." value={content} onChange={e => setContent(e.target.value)} />
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-1.5 rounded-full text-sm transition-colors cursor-pointer">Post</button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex gap-2 items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm uppercase">
                {post.username[0]}
              </div>
              <Link to={`/user/${post.username}`} className="font-bold text-gray-900 hover:underline">@{post.username}</Link>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
            <button onClick={() => handleLike(post.id)} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1">
              ❤️ {post.likes?.length || 0} Likes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const { user } = useContext(AuthContext);

  const loadProfile = () => {
    axios.get(`http://localhost:5001/api/users/${username}`).then(res => setProfile(res.data));
  };

  useEffect(() => { loadProfile(); }, [username]);

  const handleFollow = async () => {
    if (!user) return alert('Login required to follow users.');
    try {
      await axios.put(`http://localhost:5001/api/users/${profile.id}/follow`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      loadProfile();
    } catch (err) { console.log(err); }
  };

  if (!profile) return <div className="text-center py-20 text-gray-400 font-medium">Assembling Profile Elements...</div>;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-2xl mx-auto flex items-center justify-center mb-4 uppercase">
          {profile.username[0]}
        </div>
        <h2 className="text-2xl font-black text-gray-950">@{profile.username}</h2>
        <p className="text-gray-600 mt-2 mb-6 leading-relaxed">{profile.bio}</p>
        
        <div className="border-t border-b border-gray-100 py-3 mb-6 font-semibold text-gray-700">
          👥 {profile.followersCount} Network Followers
        </div>

        {user && user.username !== profile.username && profile.id && (
          <button onClick={handleFollow} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer">
            Toggle Network Connection
          </button>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister ? { username, email, password } : { email, password };
    
    try {
      const { data } = await axios.post(`http://localhost:5001/api/auth/${endpoint}`, payload);
      if (!data.token) return alert('Registration successful! Please sign in.');
      login(data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication error checkpoint triggered.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
      <h2 className="text-3xl font-black text-gray-950 text-center mb-2">{isRegister ? 'Create Profile' : 'Welcome Back'}</h2>
      <form onSubmit={handleAuth} className="space-y-4 mt-6">
        {isRegister && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Handle Username</label>
            <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Coordinates</label>
          <input type="email" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Secure Password Key</label>
          <input type="password" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors text-sm mt-2 shadow-xs cursor-pointer">
          {isRegister ? 'Register Handle' : 'Authorize Session'}
        </button>
        <p className="text-center text-xs font-medium text-gray-400 mt-4 cursor-pointer hover:underline" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have a profile? Sign In' : 'Need a workspace card? Register Here'}
        </p>
      </form>
    </div>
  );
}
