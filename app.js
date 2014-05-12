var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var flash = require('connect-flash');
var authSetup = require('./lib/auth-setup');
var routes = require('./routes');

var debug = require('debug')('azure-auth-ui:startup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
    secret: 'new secret'
}));

app.use(flash());
app.use(authSetup);

app.use('/', routes.root);

Object.keys(routes).forEach(function (routeName) {
  if (routeName !== 'root' && routeName !== 'test') {
    console.log('Binding route ' + routeName);
    app.use('/' + routeName, routes[routeName]);
  }
});

if(app.get('env') === 'development') {
  app.use('/test', routes.test);
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
