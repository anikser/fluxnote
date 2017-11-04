const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const io = require('socket.io')();

const desktop = require('./routes/desktop');
const phone = require('./routes/phone')


let app = express();

app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log('Setting up routes...');

app.use('/', desktop);
app.use('/desktop', desktop);
app.use('/phone', phone);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('Setting up socket.io event listeners...');

io.on('connection', (socket) => {
  console.log('Initiating connection...');
  socket.on('drawOn', () => {
    socket.emit('drawOn')
  });
  socket.on('drawOff', () => {
    socket.emit('drawOff')
  });
  socket.on('update', (data) => {
    socket.emit('update', {x : data.x, y : data.y});
  });
});

console.log('app started.');

module.exports = app;
