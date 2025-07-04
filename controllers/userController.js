const registerUser = (req, res) => {
  const { name, email, college } = req.body;

  // Dummy response for now
  return res.status(201).json({
    message: 'User registered (mock)',
    user: {
      name,
      email,
      college,
      role: 'student',
      verified: false,
    },
  });
};

const loginUser = (req, res) => {
  const { email } = req.body;

  // Dummy logic
  return res.status(200).json({
    message: 'Login successful (mock)',
    user: {
      email,
      token: 'mock-token-123',
    },
  });
};

module.exports = { registerUser, loginUser };
