const express = require('express');
const app = express();

// Serve static files
app.use(express.static('.'));
app.use(express.static('public'));

// Basic JSON middleware
app.use(express.json());

// Simple email endpoint
app.post('/api/send-booking-email', (req, res) => {
  res.json({ success: true, message: 'Email system ready' });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
  console.log('🎯 Admin: http://localhost:3000/admin-simple.html');
});