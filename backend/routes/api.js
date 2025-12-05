const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
// Using built-in fetch (Node 18+)

const usersFile = path.join(__dirname, '../users.json');

// --- User Auth ---
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const users = readUsers();
  if(users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashed });
  writeUsers(users);

  res.json({ message: 'Signup successful' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'All fields required' });

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if(!user) return res.status(400).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({ error: 'Incorrect password' });

  res.json({ message: `Welcome ${user.name}` });
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
