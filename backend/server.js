const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./models/db');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transferRoutes = require('./routes/transferRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'Secure Online Banking API', version: '1.0.0', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error occurred.' });
});

// Start DB & Express Server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🏦 Online Banking API Server running on port ${PORT}`);
      console.log(`URL: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
