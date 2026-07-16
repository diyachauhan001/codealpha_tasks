import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, user, logout } = useContext(StoreContext);
  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center px-8 shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wider">⚡ QUICKSHOP</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400">Products</Link>
        <Link to="/cart" className="hover:text-blue-400 font-semibold">
          Cart ({cart.reduce((acc, item) => acc + item.qty, 0)})
        </Link>
        {user ? (
          <>
            <Link to="/orders" className="hover:text-blue-400">Orders</Link>
            <span className="text-gray-400 font-medium">Hi, {user.name}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold transition-colors cursor-pointer">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-500 transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
}
