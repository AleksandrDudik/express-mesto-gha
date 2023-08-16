const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'my-secret-key');
  } catch (err) {
    throw new AuthError('Необходимо провести авторизацию');
  }
  req.user = payload;

  next();
};

module.exports = auth;
