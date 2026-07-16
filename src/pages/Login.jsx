import { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Email Address</label>
          <input type="email" className="w-full border p-2 rounded-lg" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
          <input type="password" className="w-full border p-2 rounded-lg" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer">Sign In</button>
      </form>
    </div>
  );
}
