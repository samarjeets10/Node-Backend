const { response } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require('../utils/apiResponse')
const UserModel =  require('../models/user.model');
const uploadOnCloudinary = require('../utils/cloudinary')

const registerUser = asyncHandler( async (req, res) => {
    // get user details from the frontend/postman.
    // validations - i.e not empty etc.
    // check is user already exists: username, email
    // check if images, check for avatar
    // upload images to cloudinary.
    // check if image is uploaded to the cloudinary by multer.
    // create user Object - create entry in database to sore the user.
    // remove password and refreshtoken filed from the response before passing to the frontend.
    // check for user created or not.
    // return response.

    const {
        username,
        fullName,
        email,
        password
    } = req.body;

    console.log("email :", email);


    if (
        [fullName, username, email, password].some((field) => field.trim() === "")
    ) {
        throw new apiError(400, "All fields are required");
    }


    const existedUser = UserModel.findOne({
        $or: [{ username }, { email }],
    }, console.log("username:", username, " email :", email));


    if (existedUser) {
        throw new apiError(409, "User with this email or username already exists!")
    }

    // multer provies this files for the file uploads(avatar, coverImage) :
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatorLocalPath) {
        throw new apiError(400, "Avator file is required.");
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new apiError(400, "Avatar file is required!");
    }


    // creating a entry in database :

    const user = await UserModel.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password 
    });

    const createdUser = await UserModel.findById(user._id).select(
        "-password -refreshToken"
    );


    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating the user.!")
    }


    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully!")
    );


});

module.exports = registerUser;