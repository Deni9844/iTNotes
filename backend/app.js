const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ErrorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv")
const path = require('path')


//Here when we use use() we are basically specifying the middleware
app.use(express.json()) // for having the data passed from the request in request body
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());

//locating dot env file
dotenv.config({path:"backend/config/config.env"})

//Routes imports
const semester = require('./routes/semesterRoute')
const article = require('./routes/articleRoute');
const notice = require('./routes/noticeRoute')
const query = require('./routes/queryRoute')
const asset = require('./routes/assetRoute')
const user = require('./routes/userRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1',semester);
app.use('/api/v1',article);
app.use('/api/v1',notice);
app.use('/api/v1',query);
app.use('/api/v1',asset);
app.use('/api/v1',user);
app.use('/api/v1',payment);

app.use(ErrorMiddleware)

//for production
const _dirname = path.resolve();


app.use(express.static(path.join(_dirname,"/frontend/build")));
app.get('*', (_,res) => {
    res.sendFile(path.resolve(_dirname,"frontend", "build", "index.html"))
});

module.exports = app