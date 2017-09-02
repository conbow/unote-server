var router = require('express').Router();
var i18n = require('i18n');
var auth = require('../../helpers/auth');

var sessions = require('./sessions');
var accounts = require('./accounts');
var notes = require('./notes');

router.use('/sessions', sessions);
router.use('/accounts', accounts);
router.use('/notes', notes);

// Catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error(i18n.__('NOT_FOUND'));
  err.status = 404;
  next(err);
});

// Validation error handler
router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    err.status = 422;
    if (Object.keys(err.errors).length > 1) {
      err.message = i18n.__('UNABLE_TO_VALIDATE');
    } else {
      err.message = err.errors[Object.keys(err.errors)[0]].message;
    }
  }
  next(err);
});

// API error handler
router.use(function(err, req, res, next) {
  // Render the error as JSON
  res.status(err.status || 500);
  res.json({
    error: true,
    feedback: err.message,
    debug: req.app.get('env') === 'development' ? err : undefined
  });
});

module.exports = router;
