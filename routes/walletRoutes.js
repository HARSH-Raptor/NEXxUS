const express = require('express');
const { withdrawFunds, getWallet } = require('../controllers/walletController');

const router = express.Router();

// Route to withdraw funds
router.post('/withdraw', withdrawFunds);

// Route to fetch wallet details
router.get('/:email', getWallet);

module.exports = router;
