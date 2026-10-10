const { response } = require("express");
const asyncHandler = require("../utils/asyncHandler");

const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "ok user created."
    });
});

module.exports = registerUser;