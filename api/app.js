let createError = require('http-errors');
let express = require('express');
let path = require('path');
let CustomError = require('./services/response/CustomError');

let cookieParser = require('cookie-parser');
let logger = require('morgan');

let router = require('./routes/index');
let filters = require('./Filters');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enregistrement des filtres de route
filters.forEach( el => {
  app.all( el.url, el.cb );
})
// Enregistrement du router
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.json( new CustomError(err.status.toString() || "500").toHal().render() ).end();
});

module.exports = app;
