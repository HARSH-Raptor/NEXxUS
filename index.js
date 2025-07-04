const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Config
dotenv.config();
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

const walletRoutes = require('./routes/walletRoutes');
app.use('/api/wallets', walletRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('SkillShare India API is running');
});

// Start server — KEEP THIS LAST
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);

