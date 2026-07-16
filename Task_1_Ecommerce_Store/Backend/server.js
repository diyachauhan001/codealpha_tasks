import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize Supabase Client Connection Pipeline
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  console.log('⚡ Connected to Supabase Cloud Engine Successfully');
} else {
  console.error('❌ Missing Supabase Environment Keys Configuration Error');
}

// --- SECURE AUTHENTICATION MIDDLWARE ROUTINE ---
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session authentication signature failed' });
  }
};

// --- AUTH ROUTE CHANNELS ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } }
    });

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ _id: data.user?.id, name, email, token: data.session?.access_token });
  } catch (error) {
    res.status(500).json({ message: 'Registration pipeline failure' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ message: error.message });

    res.json({
      _id: data.user?.id,
      name: data.user?.user_metadata?.display_name || email.split('@')[0],
      email: data.user?.email,
      token: data.session?.access_token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login execution fault' });
  }
});

// --- PRODUCT DIRECTORY CHANNELS ---
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

// Seed Utility Engine Endpoint (Populates your PostgreSQL tables automatically)
app.post('/api/products/seed', async (req, res) => {
  const samples = [
    { name: "Wireless Headphones", description: "Noise-cancelling premium headphones.", price: 199, image: "https://unsplash.com" },
    { name: "Smart Watch", description: "Fitness tracking with crisp OLED display.", price: 299, image: "https://unsplash.com" },
    { name: "Mechanical Keyboard", description: "Tactile switches with vibrant RGB lighting.", price: 89, image: "https://unsplash.com" }
  ];

  // Try to insert; if tables are unbuilt, tells you exactly what to write into SQL Editor
  const { data, error } = await supabase.from('products').insert(samples).select();
  if (error) {
    return res.status(400).json({ 
      message: "Please run the SQL initialization queries in your Supabase dashboard editor first.",
      error: error.message 
    });
  }
  res.json(data);
});

// --- TRANSACTIONS ORDER HISTORY ROUTING ---
app.post('/api/orders', protect, async (req, res) => {
  const { orderItems, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No items logged' });

  const { data, error } = await supabase.from('orders').insert({
    user_id: req.user.id,
    order_items: orderItems,
    total_price: totalPrice
  }).select();

  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(data[0]);
});

app.get('/api/orders/myorders', protect, async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*').eq('user_id', req.user.id);
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Supabase Express Router running on port ${PORT}`));
