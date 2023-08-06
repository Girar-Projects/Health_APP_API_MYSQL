const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';

function queryError(res, err) {
  console.error('Error executing query: ' + err.stack);
  res.sendStatus(500);
}

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token.split(' ')[1], secretKey);
    if (user.type === 'professional' || user.type === 'organization') {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  queryError,
  authenticate,
};