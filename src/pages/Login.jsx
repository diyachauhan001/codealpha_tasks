import { useState, useContext } from 'react';
import axios from 'react-router-dom'; // Note: update below to use standard event tracking
import { SocialContext } from '../context/SocialContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(SocialContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('http://localhost:5001/api/auth/login', { email, password });
      loginUser(data);
      navigate('/');
    } catch (err) { alert('Credential verification signature mismatch'); }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
      <h2 className="text-3xl font-black text-gray-950 text-center mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
          <input type="email" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Secure Password Key</label>
          <input type="password" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors text-sm mt-2 shadow-sm cursor-pointer">Authorize Session</button>
      </form>
    </div>
  );
}
