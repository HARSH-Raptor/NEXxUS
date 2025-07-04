const express = require('express');
const router = express.Router();

const { purchasePost } = require('../controllers/transactionController');

router.post('/purchase/:postId', purchasePost);

module.exports = router;
