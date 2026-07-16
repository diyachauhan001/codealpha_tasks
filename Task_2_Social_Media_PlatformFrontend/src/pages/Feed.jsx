import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SocialContext } from '../context/SocialContext';
import { Link } from 'react-router-dom';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useContext(SocialContext);

  const fetchTimeline = () => {
    axios.get('http://localhost:5001/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchTimeline(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const { data } = await axios.post('http://localhost:5001/api/posts', { content }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPosts([data, ...posts]);
      setContent('');
    } catch (err) { alert('Session validation expired'); }
  };

  const handleLike = async (id) => {
    if (!user) return alert('Please sign in to interact.');
    try {
      await axios.put(`http://localhost:5001/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTimeline();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {user && (
        <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <textarea className="w-full border-0 focus:outline-hidden resize-none text-lg text-gray-800 placeholder-gray-400" rows="3" placeholder="What's happening?" value={content} onChange={e => setContent(e.target.value)} />
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-1.5 rounded-full text-sm transition-colors cursor-pointer">Post</button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex gap-3 items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {post.username[0].toUpperCase()}
              </div>
              <Link to={`/user/${post.username}`} className="font-bold text-gray-900 hover:underline">@{post.username}</Link>
            </div>
            <p className="text-gray-800 text-base leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
              <button onClick={() => handleLike(post._id)} className="hover:text-blue-600 transition-colors cursor-pointer">❤️ {post.likes?.length} Likes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
