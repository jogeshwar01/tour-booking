const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));     //public is default folder--to serve static files like any html or images

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//mounting routers  
app.use('/api/v1/tours', tourRouter);   //tourRouter is middleware to be applied for specific url
app.use('/api/v1/users', userRouter);

//to handle for all the requests/http methods.  -order matters hence this has to be at the last else all requests will go into this
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    //next function with an argument is always taken as an error by express 
    //and all other normal middlewares are skipped and we go to global error handling middleware
});

app.use(globalErrorHandler);

module.exports = app;

