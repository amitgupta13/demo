const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const error = require('./middleware/error');
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var betRouter = require('./routes/bets');
var lobbiesRouter = require('./routes/lobbies');
const eventsRoutes = require('./routes/events');
const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

var app = express();

winston.handleExceptions(
  new winston.transports.Console({colorize:true},{prettyPrint:true}),
  new winston.transports.File({filename:'uncaughtExceptions.log'})
);

process.on('unhandledRejection', (ex)=>{
              throw ex;
      });

winston.add(winston.transports.File, {filename:'logfile.log'});
winston.add(winston.transports.MongoDB, {db:'mongodb://localhost/test',level:'info'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//fire express validator
app.use(expressValidator());

app.use(cors());
//CORS
app.use(function(req, res, next) {
  res.header("access-control-allow-methods", "GET, POST, PUT");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//Route Handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bets', betRouter);
app.use('/lobbies', lobbiesRouter);
app.use('/events', eventsRoutes);
app.use(error);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;