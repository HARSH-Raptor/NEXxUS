const express = require('express');
const router = express.Router();

const { submitComplaint, resolveComplaint } = require('../controllers/complaintController');

router.post('/submit', submitComplaint);
router.put('/resolve/:complaintId', resolveComplaint);

module.exports = router;
