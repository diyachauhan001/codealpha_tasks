import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(StoreContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(() => {
        // If DB is blank, call seed utility endpoint automatically
        axios.post('http://localhost:5000/api/products/seed')
          .then(res => setProducts(res.data));
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Featured Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col bg-white">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{product.description}</p>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xl font-black text-blue-600">${product.price}</span>
              <button onClick={() => addToCart(product)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer">
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
