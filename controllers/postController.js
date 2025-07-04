const allPosts = require('../mock/posts');

const boostedPosts = [];

const createPost = (req, res) => {
  const { title, description, price, category, isFree, college, postedBy } = req.body;

  const mockPost = {
    title,
    description,
    price,
    category,
    isFree,
    status: 'available',
    college,
    postedBy,
    datePosted: new Date(),
  };

  return res.status(201).json({
    message: 'Post created (mock)',
    post: mockPost,
  });
};

const getPostsByCollege = (req, res) => {
  const collegeName = req.params.collegeName;

  return res.status(200).json({
    message: `Posts for ${collegeName}`,
    posts: allPosts.filter((post) => post.college === collegeName),
  });
};

const updatePostStatus = (req, res) => {
  const { postId } = req.params;
  const { status } = req.body;

  if (!['available', 'sold'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const updatedPost = {
    postId,
    status,
    updatedAt: new Date(),
  };

  return res.status(200).json({
    message: 'Post status updated (mock)',
    post: updatedPost,
  });
};

const boostPost = (req, res) => {
  const { postId } = req.params;
  const { boostLevel } = req.body;

  const validLevels = ["college", "regional", "national"];
  if (!validLevels.includes(boostLevel)) {
    return res.status(400).json({ message: 'Invalid boost level' });
  }

  const boostedPost = {
    postId,
    isBoosted: true,
    boostLevel,
    boostedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  boostedPosts.push(boostedPost);

  return res.status(200).json({
    message: 'Post boosted successfully (mock)',
    boostedPost,
  });
};

const getBoostedPostsByScope = (req, res) => {
  const { scope } = req.params;

  const now = new Date();
  const filtered = boostedPosts.filter(
    (b) => b.boostLevel === scope && new Date(b.expiresAt) > now
  );

  return res.status(200).json({
    message: `Boosted posts for scope: ${scope}`,
    boosted: filtered,
  });
};

const searchPosts = (req, res) => {
  const { keyword, college, region } = req.query;

  if (!keyword || !college || !region) {
    return res.status(400).json({ message: 'Keyword, college, and region are required' });
  }

  const keywordLower = keyword.toLowerCase();

  const collegeResults = allPosts.filter(
    (post) =>
      post.college === college &&
      (post.title.toLowerCase().includes(keywordLower) ||
       post.description.toLowerCase().includes(keywordLower))
  );

  if (collegeResults.length > 0) {
    return res.status(200).json({
      message: `Search results for "${keyword}" in ${college}`,
      results: collegeResults,
      fallback: null,
    });
  }

  // Fallback: Nearby colleges
  const nearbyResults = allPosts.filter(
    (post) =>
      post.college !== college &&
      post.region === region &&
      post.title.toLowerCase().includes(keywordLower)
  );

  if (nearbyResults.length > 0) {
    return res.status(200).json({
      message: `No results in ${college}. Showing results from nearby colleges.`,
      results: nearbyResults,
      fallback: 'nearby',
    });
  }

  // Fallback: National level
  const nationalResults = allPosts.filter(
    (post) =>
      post.college !== college &&
      post.title.toLowerCase().includes(keywordLower)
  );

  return res.status(200).json({
    message: `No results in ${college} or nearby colleges. Showing national results.`,
    results: nationalResults,
    fallback: 'national',
  });
};

module.exports = {
  createPost,
  getPostsByCollege,
  updatePostStatus,
  boostPost,
  getBoostedPostsByScope,
  searchPosts,
};
