
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const apiError = require('../utils/apiError');

const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
            throw new apiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new apiError(401, "Invalid access token!");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token!");
    }

});

module.exports = verifyJWT;