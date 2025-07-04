const complaints = require('../mock/complaints');
const wallets = require('../mock/wallets');

// Submit complaint
const submitComplaint = (req, res) => {
  const { postId, buyer, seller, price, reason } = req.body;

  const newComplaint = {
    complaintId: `C${complaints.length + 1}`,
    postId,
    buyer,
    seller,
    price,
    reason,
    submittedAt: new Date(),
    status: 'pending',
  };

  complaints.push(newComplaint);

  return res.status(201).json({
    message: 'Complaint submitted successfully (mock)',
    complaint: newComplaint,
  });
};

// Resolve complaint (by admin)
const resolveComplaint = (req, res) => {
  const { complaintId } = req.params;
  const { isValid, adminName } = req.body;

  const complaint = complaints.find(c => c.complaintId === complaintId);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  if (complaint.status !== 'pending') {
    return res.status(400).json({ message: 'Complaint already resolved' });
  }

  complaint.status = `resolved by ${adminName} (${isValid ? 'valid' : 'invalid'})`;
  complaint.resolvedBy = adminName;
  complaint.resolvedAt = new Date();

  let refundDetails = null;

  if (isValid) {
    const { email: buyerEmail } = complaint.buyer;
    const { email: sellerEmail } = complaint.seller;
    const refundAmount = complaint.price;
    const platformFee = Math.floor(refundAmount * 0.10);
    const refundToBuyer = refundAmount - platformFee;

    if (wallets[sellerEmail]) {
      wallets[sellerEmail].balance -= refundToBuyer;
      wallets[sellerEmail].locked -= refundToBuyer;
    }

    refundDetails = {
      refundedTo: buyerEmail,
      refundAmount: refundToBuyer,
      platformFeeRetained: platformFee
    };
  }

  return res.status(200).json({
    message: 'Complaint resolved (mock)',
    complaint,
    refund: refundDetails
  });
};

module.exports = {
  submitComplaint,
  resolveComplaint,
};
