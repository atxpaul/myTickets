import jwt from 'jsonwebtoken';

function generateToken(user) {
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );
  return token;
}

export { generateToken };
