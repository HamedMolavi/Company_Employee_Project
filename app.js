//------------------------------------------------------        Require
const createError = require('http-errors');
const rfs = require('rotating-file-stream')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { redisStoreConnect } = require('./utils/session');
const logger = require('morgan');
const dlog = require('./utils/log').dlog(__filename);
const errlog = require('./utils/log').errlog(__filename);
const path = require('path');
const express = require('express');
const makeConnection = require('./database/connection');
//------------------------------------------------------        Routes
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const companyRouter = require('./routes/company');
const employeeRouter = require('./routes/employee');
const cookiesRouter = require('./routes/cookies');
const dashboardRouter = require('./routes/dashboard');
//------------------------------------------------------        Express Instance
const app = express();
//------------------------------------------------------        Files
app.use(express.static(path.join(__dirname, 'public')));
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
});

//------------------------------------------------------        View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//------------------------------------------------------        Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
store = redisStoreConnect()
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: null,
    }
}));

//------------------------------------------------------        Setup logger
app.use(logger('combined', {
    stream: accessLogStream,
    // log only 4xx and 5xx responses
    skip: function (_req, res) { return res.statusCode < 400 }
}))
if (process.env.MODE === 'development') app.use(logger('dev'))
//------------------------------------------------------        Assign Routes
makeConnection()
    .then(function (models) {
        dlog("Database Connected.")
        app.use('/login', loginRouter({ models }));
        app.use('/company', companyRouter({ models }));
        app.use('/employee', employeeRouter({ models }));
        app.use('/admin', adminRouter({ models }));
        app.use('/cookies', cookiesRouter({ models }));
        app.use('/dashboard', dashboardRouter({ models }));


        // catch 404 and forward to error handler
        app.use(function (_req, _res, next) {
            next(createError(404));
        });

        // error handler
        app.use(errorHandler);

    }).catch((err) => {
        errlog('Error in making routes (app.js) ->', err);
    });
;

errorHandler = function (err, req, res, _next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}

module.exports = app;
