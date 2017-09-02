var router = require('express').Router();
var i18n = require('i18n');
var auth = require('../../helpers/auth');
var Account = require('../../models/Account');

/**
 * GET /accounts/verify/:token
 * Verify account email
 */
router.get('/verify/:token', function(req, res, next) {
  /*
  //console.log('Email: ' + req.account.email);
  mail('connorbowm@gmail.com', 'Testing', 'This is just a test');
  res.json({
    success: true,
    feedback: 'E-mail sent'
  });*/
});

/**
 * GET /accounts
 * Read accounts, admin only
 */
router.get('/', function(req, res, next) {
  Account.find(function(err, accounts) {
    if (!err && accounts) {
      res.send(accounts);
    } else {
      next();
    }
  });
});

/**
 * POST /accounts
 * Create account
 */
router.post('/', function(req, res, next) {
  var account = new Account({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  account.save(function(err) {
    if (err) {
      if (err.code === 11000 || err.code === 11001) {
        var error = new Error(i18n.__('EMAIL_ALREADY_EXISTS'));
        error.status = 409;
        next(error);
      } else {
        next(err);
      }
    } else {
      res.status = 201;
      res.json({
        success: true,
        feedback: i18n.__('ACCOUNT_CREATED')
      });
    }
  });
});

/**
 * GET /accounts/:id
 * Read account, admin and owner only
 */
router.get('/:id', auth, function(req, res, next) {
  if (req.account._id == req.params.id || req.account.role == 'admin') {
    Account.findById(req.params.id, function(err, account) {
      if (!err && account) {
        res.send(account);
      } else {
        next();
      }
    });
  } else {
    var err = new Error(i18n.__('FORBIDDEN'));
    err.status = 403;
    next(err);
  }
});

/**
 * PUT /accounts/:id
 * Update account, admin and owner only
 */
router.put('/:id', auth, function(req, res) {
  var put = {
    name: req.body.name,
    email: req.body.email
  };
  if (req.body.password) {
    put.password = req.body.password;
  }
  if (req.account._id == req.params.id || req.account.role == 'admin') {
    Account.findByIdAndUpdate(req.params.id, put, function(err, account) {
      if (!err && account) {
        res.send(account);
      } else {
        var err = new Error(i18n.__('UNABLE_TO_UPDATE_ACCOUNT'));
        err.status = 403;
        next(err);
      }
    });
  } else {
    var err = new Error(i18n.__('FORBIDDEN'));
    err.status = 403;
    next(err);
  }
});

/**
 * DELETE /accounts/:id
 * Delete account, admin and owner only
 */
router.delete('/:id', auth, function(req, res, next) {
  if (req.account._id == req.params.id || req.account.role == 'admin') {
    Account.findByIdAndRemove(req.params.id, function(err, account) {
      if (!err && account) {
        res.status = 202;
        res.send({
          success: true,
          feedback: i18n.__('ACCOUNT_DELETED')
        });
      } else {
        var error = new Error(i18n.__('UNABLE_TO_DELETE_ACCOUNT'));
        error.status = 400;
        next(error);
      }
    });
  } else {
    var error = new Error(i18n.__('FORBIDDEN'));
    error.status = 403;
    next(error);
  }
});

module.exports = router;
