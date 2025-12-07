const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
// Using built-in fetch (Node 18+)

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if(existingUser) return res.status(400).json({ error: 'Email or username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    res.json({ 
      message: 'Signup successful', 
      user: { 
        username: newUser.username, 
        email: newUser.email, 
        balanceUSD: newUser.balanceUSD, 
        createdAt: newUser.createdAt 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if(!identifier || !password) return res.status(400).json({ error: 'All fields required' });

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if(!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ error: 'Incorrect password' });

    res.json({ 
      message: `Welcome ${user.username}`, 
      user: { 
        username: user.username, 
        email: user.email, 
        balanceUSD: user.balanceUSD, 
        createdAt: user.createdAt 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Coins endpoint
router.get('/coins', async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

// Chart data endpoint
router.get('/chart/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days = 7 } = req.query;
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

module.exports = router;
