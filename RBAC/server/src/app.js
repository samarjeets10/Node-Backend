const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const { apiLimiter } = require('./middlewares/rate-limit.middleware');

const app = express();

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser());

// General api limit :
app.use('/api', apiLimiter);

// routes declaration :
app.use('/api/users', authRoutes);

// Protected routes :
app.use('/api', apiLimiter, userRoutes);


module.exports = app;