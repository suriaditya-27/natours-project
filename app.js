const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError.js');
app.use(express.json()); // for middleware
const globalErrorHandler = require('./Controllers/errorController.js');
//need to import userRouter and tourRouter
const tourRouter = require('D:/complete-node-bootcamp-master/4-natours/starter/Routes/tourRoutes.js');
const usersRouter = require('D:/complete-node-bootcamp-master/4-natours/starter/Routes/userRoutes.js');

// 1. MiddleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2.Route Handlers

// const tourRouter = express.Router();
// const usersRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res) => {
  next(new AppError(`Route not found- ${req.originalUrl}`, 404)); // this will pass the error to the global error handling middleware
});

// res.status(404).json({
//   status: 'fail',
//   message: `Route not found- ${req.originalUrl}`,
// });

// const err = new Error(`Route not found- ${req.originalUrl}`);
// err.statusCode = 404;
// err.status = 'fail';

app.use(globalErrorHandler); // this will handle all the errors that are passed to it from the route handlers and middlewares

module.exports = app;
