const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Unable to connect to MongoDB:', error.message);
  });

app.use(cors());
app.use(middleware.tokenExtractor);
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
