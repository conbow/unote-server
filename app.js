var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    localize = require('./locales/localize'),
    mongoose = require('mongoose'),
    auth = require('./helpers/auth');

var routes = require('./routes/index'),
    sessions = require('./routes/sessions'),
    accounts = require('./routes/accounts'),
    notes = require('./routes/notes');

var app = express();

/**
 * Config
 */
// Connect to MongoDB
mongoose.connect(config.database);

/**
 * View Engine
 */
// TODO Remove
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Middleware
 */
//app.use('/', auth);

/**
 * Routes
 */
app.use('/', routes);
app.use('/sessions', sessions);
app.use('/accounts', accounts);
app.use('/notes', auth, notes);

/**
 * Error Handling
 */
// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error(localize('NOT_FOUND'));
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: true, feedback: err.message });
});

module.exports = app;