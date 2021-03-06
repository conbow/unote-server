var jwt = require('jsonwebtoken');
var i18n = require('i18n');
var config = require('../config');

module.exports = function(req, res, next) {
  // Get token from header
  if (req.headers && req.headers.authorization) {
    var auth = req.headers.authorization.split(' ');
    if (auth.length === 2 && auth[0] === 'Bearer') {
      var token = auth[1];
    }
  }
  // Verify token
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          var error = new Error(i18n.__('AUTHENTICATION_EXPIRED'));
        } else {
          var error = new Error(i18n.__('AUTHENTICATION_FAILED'));
        }
        error.status = 401;
        next(error);
      } else {
        req.account = decoded;
        next();
      }
    });
  } else {
    var error = new Error(i18n.__('AUTHENTICATION_FAILED'));
    error.status = 401;
    next(error);
  }
};

module.exports.isAdmin = function(req, res, next) {
  if (req.account && req.account.role === 'admin') {
    next();
  } else {
    var error = new Error(i18n.__('FORBIDDEN'));
    error.status = 403;
    next(error);
  }
};
