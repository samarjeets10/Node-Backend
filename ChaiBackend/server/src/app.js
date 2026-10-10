const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');

const app = express();

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(cookieParser());


// routes declaration :

app.use('/api/v1/users', userRouter); // prefix as /api/v1/users for the url.

module.exports = app;