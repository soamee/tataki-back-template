const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressPino = require('express-pino-logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./components/logger')({});

const healthRoutes = require('./domain/health/routes');
const usersRoutes = require('./domain/users/routes');
const rolesRoutes = require('./domain/roles/routes');
const authRoutes = require('./domain/auth/routes');

const app = express();

const expressLogger = expressPino({ logger });

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
}));
app.use(expressLogger);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/health', healthRoutes);
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
