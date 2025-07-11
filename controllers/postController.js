const allPosts = require('../mock/posts');
const boostedPosts = [];

const createPost = (req, res) => {
  const { title, description, price, category, isFree, college, postedBy, tags } = req.body;

  const mockPost = {
    title,
    description,
    price,
    category,
    isFree,
    status: 'available',
    college,
    postedBy,
    tags: tags || [],
    verified: true, // mock
    visibility: 'public',
    region: 'central', // mock
    datePosted: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

  const validLevels = ['college', 'regional', 'national'];
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
  const {
    keyword = '',
    college,
    region,
    minPrice,
    maxPrice,
    isFree,
    category,
    tags,
    sortBy = 'newest',
    verifiedOnly,
    page = 1,
    limit = 10,
  } = req.query;

  if (!college || !region) {
    return res.status(400).json({ message: 'College and region are required' });
  }

  const keywordLower = keyword.toLowerCase();
  const tagArray = tags ? tags.split(',').map((t) => t.trim().toLowerCase()) : [];

  const now = new Date();
  const baseFilter = (post) => {
    const matchesCollege = post.college === college;
    const matchesRegion = post.region === region;
    const matchesKeyword =
      post.title.toLowerCase().includes(keywordLower) ||
      post.description.toLowerCase().includes(keywordLower);
    const matchesFree = isFree === undefined || post.isFree === (isFree === 'true');
    const matchesCategory = !category || post.category.toLowerCase() === category.toLowerCase();
    const matchesPrice =
      (!minPrice || post.price >= parseInt(minPrice)) &&
      (!maxPrice || post.price <= parseInt(maxPrice));
    const matchesVerified = !verifiedOnly || post.verified === true;
    const matchesVisibility = post.visibility !== 'hidden';
    const notExpired = !post.expiresAt || new Date(post.expiresAt) > now;
    const matchesTags =
      tagArray.length === 0 ||
      (post.tags && post.tags.some((tag) => tagArray.includes(tag.toLowerCase())));

    return (
      matchesKeyword &&
      matchesFree &&
      matchesCategory &&
      matchesPrice &&
      matchesVerified &&
      matchesVisibility &&
      notExpired &&
      matchesTags &&
      matchesCollege
    );
  };

  const fallbackFilter = (scope) => (post) => {
    const matchesScope = scope === 'region'
      ? post.region === region && post.college !== college
      : post.college !== college;

    return baseFilter({ ...post, college: post.college }) && matchesScope;
  };

  const sortPosts = (posts) => {
    return posts.sort((a, b) => {
      if (sortBy === 'lowest') return a.price - b.price;
      if (sortBy === 'highest') return b.price - a.price;
      return new Date(b.datePosted) - new Date(a.datePosted);
    });
  };

  const paginate = (posts) => {
    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    return posts.slice(start, end);
  };

  const matchedBoosted = boostedPosts
    .filter((b) => new Date(b.expiresAt) > now)
    .map((b) => allPosts.find((p) => p.id === b.postId))
    .filter((post) => post && baseFilter(post));

  let filtered = allPosts.filter(baseFilter);
  if (filtered.length === 0) {
    const regionFallback = allPosts.filter(fallbackFilter('region'));
    if (regionFallback.length > 0) {
      return res.status(200).json({
        message: `No results in ${college}. Showing results from nearby colleges.`,
        boostedPosts: matchedBoosted,
        normalPosts: paginate(sortPosts(regionFallback)),
        totalResults: regionFallback.length,
        page: parseInt(page),
        fallback: 'nearby',
      });
    }

    const nationalFallback = allPosts.filter(fallbackFilter('national'));
    return res.status(200).json({
      message: `No results in ${college} or nearby colleges. Showing national results.`,
      boostedPosts: matchedBoosted,
      normalPosts: paginate(sortPosts(nationalFallback)),
      totalResults: nationalFallback.length,
      page: parseInt(page),
      fallback: 'national',
    });
  }

  const sorted = sortPosts(filtered);
  const paginated = paginate(sorted);

  return res.status(200).json({
    message: `Search results for "${keyword}" in ${college}`,
    boostedPosts: matchedBoosted,
    normalPosts: paginated,
    totalResults: filtered.length,
    page: parseInt(page),
    fallback: null,
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
