const wallets = require('../mock/wallets');

// Withdraw Funds (with cooldown check)
const withdrawFunds = (req, res) => {
  const { email } = req.body;
  const userWallet = wallets[email];

  if (!userWallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  const now = new Date();
  if (userWallet.locked === 0 || now < new Date(userWallet.releaseDate)) {
    return res.status(400).json({ message: 'Funds are still in cooldown or unavailable' });
  }

  const withdrawnAmount = userWallet.locked;

  userWallet.locked = 0;
  userWallet.releaseDate = null;

  return res.status(200).json({
    message: 'Withdrawal successful (mock)',
    withdrawnAmount,
    remainingBalance: userWallet.balance,
    timestamp: now,
  });
};

// Get Wallet Details (mock)
const getWallet = (req, res) => {
  const { email } = req.params;
  const userWallet = wallets[email];

  if (!userWallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  return res.status(200).json({
    message: 'Wallet details fetched successfully (mock)',
    wallet: userWallet
  });
};

module.exports = {
  withdrawFunds,
  getWallet
};
