const jwt = require('jsonwebtoken');
const config = require('./token-config.js');
const ResponseError = require('./response-error');
const User = require('../../models/user');

const getTokenUser = (request) => {
  const promise = new Promise((resolve, reject) => {
    getDecodedToken(request)
        .then((decoded) => User.findOne( {where: {
          id: decoded.id,
          password: decoded.password
        }
      }).then((row) => resolve(row)))
        .catch((error) => reject(error));
  });
  return promise;
};

const getDecodedToken = (request) => {
  const promise = new Promise((resolve, reject) => {
    const data = request.query;
    const token = data.access_token;
    if (!token) {
      reject(new ResponseError('No token provided.', 401));
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(new ResponseError('Failed to authenticate token.', 500));
      }
      resolve(decoded);
    });
  });

  return promise;
};

module.exports.getDecodedToken = getDecodedToken;
module.exports.getTokenUser = getTokenUser;

