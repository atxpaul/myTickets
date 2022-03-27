import jwt from 'jsonwebtoken';
function checkAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'not authenticated',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'not authorized',
      });
    }

    req.user = decoded.data;
    next();
  });
}

export default checkAuthentication;
