require('dotenv').config();
const path = require('path');
//------------------------------------------------------
const express = require('express');
const makeConnection = require('./database/connection');
//------------------------------------------------------
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const companyRouter = require('./routes/company');
const employeeRouter = require('./routes/employee');
//------------------------------------------------------
const app = express();
const port = process.env.PORT || 3000;
//------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
//------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



makeConnection()
    .then(function (database) {
        console.log('\n\n=================\nDatabase is connected.\n=================');
        app.use('/', (req, _res, next)=>{
            console.log('\n\n\nRequest body ->', req.body, '\nRequest query ->', req.query, '\nRequest route ->', req.path);
            next();
        });
        app.use('/login', loginRouter({ database }));
        app.use('/company', companyRouter({ database }));
        app.use('/employee', employeeRouter({ database }));
        app.use('/admin', adminRouter({ database }));
        app.use('/', loginRouter({ database }));
    }).catch((err) => {
        console.log('Error in making routes (app.js) ->', err);
    });
;



app.listen(port, 'localhost', (err) => {
    !!err ? console.log('starting app crashed\n', err) : console.log('Server is up on port => ', port, '\n=================');
});