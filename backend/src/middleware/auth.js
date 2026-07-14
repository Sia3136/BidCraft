const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.cookies?.session_token;
  
  if (!token) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
  }

  if (!token) return res.status(401).json({ error: 'missing_auth' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};
