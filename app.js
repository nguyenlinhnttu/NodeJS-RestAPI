const express = require('express');

const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//Add Router
const productRouter = require('./api/router/products');
const ordersRouter = require('./api/router/orders');
const userRouter = require('./api/router/users');

//connect mongoose db

mongoose.connect('mongodb+srv://admin:admin@cluster0-byxd6.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
}, function (err, client) {
    if (err) {
        console.log(err);
    }
    console.log('connect!!!');
});
mongoose.Promise = global.Promise;
//Tracking Log
app.use(morgan('dev'))
app.use('/uploads',express.static('uploads/'));
//Parser json body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Allow Request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Orgin', '*')
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Router which should handle request
app.use('/products', productRouter);
app.use('/orders', ordersRouter);
app.use('/users', userRouter);
//Handle Error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;