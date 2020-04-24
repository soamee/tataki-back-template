const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./components/logger')({});
const configureExpressLogger = require('./components/network-logger');

const healthRoutes = require('./domain/health/routes');
const usersRoutes = require('./domain/users/routes');
const authRoutes = require('./domain/auth/routes');

const app = express();

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
}));
configureExpressLogger({ app, logger });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/health', healthRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
