import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, user, removeFromCart, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    try {
      await axios.post('http://localhost:5000/api/orders', { orderItems: cart, totalPrice }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      clearCart();
      alert('Order Placed Successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Checkout Failed');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? <p className="text-gray-500">Your cart is empty.</p> : (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-bold text-lg">${item.price * item.qty}</span>
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 font-semibold hover:underline cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center font-bold text-2xl border-t pt-4">
            <span>Total:</span>
            <span className="text-blue-600">${totalPrice}</span>
          </div>
          <button onClick={handleCheckout} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md cursor-pointer transition-colors">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
