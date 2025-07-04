const express = require('express');
const router = express.Router();

const {
  createPost,
  getPostsByCollege,
  updatePostStatus,
  boostPost,
  getBoostedPostsByScope,
  searchPosts
} = require('../controllers/postController');

router.post('/create', createPost);
router.get('/college/:collegeName', getPostsByCollege);
router.put('/status/:postId', updatePostStatus);
router.post('/boost/:postId', boostPost); // ✅ Corrected method
router.get('/boosted/:scope', getBoostedPostsByScope);
router.get('/search', searchPosts); // ✅ Add this line
module.exports = router;
