const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required. please login."
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }

}


module.exports = verifyToken;