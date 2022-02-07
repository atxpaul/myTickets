function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ err: 'User not authenticated' });
  }
}

export default checkAuthentication;
