import jwt from 'jsonwebtoken';

function generateToken(user) {
  const token = jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return token;
}

export { generateToken };
