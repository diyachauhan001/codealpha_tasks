import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(StoreContext);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? <p className="text-gray-500">No orders found.</p> : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-white flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Order Ref: {order._id}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">Status: <span className="text-emerald-600 font-semibold">Processing Order</span></p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">${order.totalPrice}</p>
                <p className="text-xs text-gray-500">{order.orderItems.length} items logged</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
