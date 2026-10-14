const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.router');

const app = express();

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser());

// routes declaration :

app.use('/api/v1/users', userRouter);


module.exports = app;