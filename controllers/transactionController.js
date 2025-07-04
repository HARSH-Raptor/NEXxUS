// Fake in-memory wallets
const wallets = {};

const purchasePost = (req, res) => {
  const { postId } = req.params;
  const { buyer, seller, price } = req.body;

  const platformFee = price * 0.10;
  const sellerEarnings = price * 0.90;

  const releaseDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days later

  // Update seller wallet
  const sellerEmail = seller.email;
  if (!wallets[sellerEmail]) {
    wallets[sellerEmail] = { balance: 0, locked: 0, releaseDate: null };
  }
  wallets[sellerEmail].balance += sellerEarnings;
  wallets[sellerEmail].locked += sellerEarnings;
  wallets[sellerEmail].releaseDate = releaseDate;

  // Update central admin wallet
  const adminEmail = 'central_admin@thenexxus.in';
  if (!wallets[adminEmail]) {
    wallets[adminEmail] = { balance: 0 };
  }
  wallets[adminEmail].balance += platformFee;

  const transaction = {
    postId,
    buyer,
    seller,
    price,
    platformFee,
    sellerEarnings,
    status: 'pending withdrawal',
    purchasedAt: new Date(),
    releaseDate,
  };

  return res.status(201).json({
    message: 'Transaction successful (mock)',
    transaction,
    updatedWallets: wallets
  });
};

module.exports = {
  purchasePost,
};
