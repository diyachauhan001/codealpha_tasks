import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Establish Supabase Connection Core Pipeline
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

console.log('⚡ Connected Social Platform Engine to Supabase Dashboard Context');

// --- SECURE SECURITY IDENTIFICATION MIDDLEWARE ---
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed session token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authorization signatures check failed' });
  }
};
// Universal key parsing mapping engine
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment configuration mismatch error. Missing key tokens.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('⚡ Connected Social Platform Engine to Supabase Dashboard Context');


// --- AUTH ROUTING ENDPOINTS ---
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ _id: data.user?.id, username, email, token: data.session?.access_token });
  } catch (err) {
    res.status(500).json({ message: 'Execution fault' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ message: error.message });
    res.json({
      _id: data.user?.id,
      username: data.user?.user_metadata?.username || email.split('@')[0],
      email: data.user?.email,
      token: data.session?.access_token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server entry validation mismatch' });
  }
});

// --- CHRONOLOGICAL GLOBAL TIMELINE FEED ROUTES ---
app.post('/api/posts', protect, async (req, res) => {
  const { content } = req.body;
  const username = req.user.user_metadata?.username || "anonymous";

  const { data, error } = await supabase.from('social_posts').insert({
    user_id: req.user.id,
    username: username,
    content: content,
    likes: []
  }).select();

  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(data[0]);
});

app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

app.put('/api/posts/:id/like', protect, async (req, res) => {
  const { data: post, error: fetchErr } = await supabase.from('social_posts').select('*').eq('id', req.params.id).single();
  if (fetchErr) return res.status(404).json({ message: 'Post tracking element absent' });

  let currentLikes = Array.isArray(post.likes) ? post.likes : [];
  if (currentLikes.includes(req.user.id)) {
    currentLikes = currentLikes.filter(uid => uid !== req.user.id);
  } else {
    currentLikes.push(req.user.id);
  }

  const { data: updatedPost, error: saveErr } = await supabase.from('social_posts').update({ likes: currentLikes }).eq('id', req.params.id).select().single();
  if (saveErr) return res.status(400).json({ message: saveErr.message });
  res.json(updatedPost);
});

// --- NETWORK RELATIONSHIP GRAPH ENDPOINTS ---
app.get('/api/users/:username', async (req, res) => {
  const { data, error } = await supabase.from('social_posts').select('user_id').eq('username', req.params.username).limit(1);
  if (error || !data.length) return res.json({ username: req.params.username, bio: "Nexus network space explorer profile layout active grid.", followersCount: 0 });
  
  const targetUid = data[0].user_id;
  const { count } = await supabase.from('social_follows').select('*', { count: 'exact', head: true }).eq('following_id', targetUid);
  res.json({ username: req.params.username, bio: "Active Nexus workspace profile grid.", followersCount: count || 0, id: targetUid });
});

app.put('/api/users/:id/follow', protect, async (req, res) => {
  const { data: existing } = await supabase.from('social_follows').select('*').eq('follower_id', req.user.id).eq('following_id', req.params.id);
  
  if (existing && existing.length > 0) {
    await supabase.from('social_follows').delete().eq('follower_id', req.user.id).eq('following_id', req.params.id);
    return res.json({ message: 'Unfollowed successfully' });
  }

  await supabase.from('social_follows').insert({ follower_id: req.user.id, following_id: req.params.id });
  res.json({ message: 'Followed successfully' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Social Platform Express API Server active on port ${PORT}`));
