var router = require('express').Router();
var i18n = require('i18n');
var jwt = require('jsonwebtoken');
var Account = require('../../models/Account');
var config = require('../../config');

/**
 * GET /sessions
 * Read sessions - admin only
 */
router.get('/', function(req, res, next) {
  // TODO For when sessions are tied to memory store
});

/**
 * POST /sessions
 * Create session
 */
router.post('/', function(req, res, next) {
  Account.findOne({
    email: req.body.email
  })
    .select('+password')
    .exec(function(err, account) {
      if (!err && account) {
        account.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch) {
            var accountObject = account.toObject();
            delete accountObject.password;
            accountObject.sessionToken = jwt.sign(
              accountObject,
              config.secret,
              {
                expiresIn: '1 hour'
              }
            );
            res.json(accountObject);
          } else {
            var newErr = new Error();
            newErr.message = i18n.__('INVALID_LOGIN_INFORMATION');
            newErr.status = 422;
            next(newErr);
          }
        });
      } else {
        var newErr = new Error();
        newErr.message = i18n.__('INVALID_LOGIN_INFORMATION');
        next(newErr);
      }
    });
});

/**
 * DELETE /sessions/:id
 * Delete session, admin and self only
 */
router.delete('/:id', function(req, res, next) {
  // TODO For when sessions are tied to memory store
});

module.exports = router;
