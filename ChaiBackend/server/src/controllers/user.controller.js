const asyncHandler = require("../utils/asyncHandler");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require('../utils/apiResponse');
const UserModel =  require('../models/user.model');
const uploadOnCloudinary = require('../utils/cloudinary');

const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await UserModel.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access tokens.");
    }
}


const registerUser = asyncHandler( async (req, res, next) => {
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
    } = req.body ?? {};

    // console.log("email :", email);


    if (
        [fullName, username, email, password].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }


    const existedUser = await UserModel.findOne({
        $or: [{ username }, { email }],
    });


    if (existedUser) {
        throw new apiError(409, "User with this email or username already exists!")
    }

    // console.log(req.files);

    // multer provies this files for the file uploads(avatar, coverImage) :
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
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



const loginUser = asyncHandler(async (req, res) => {

    // req body : data
    // username or email based login 
    // find the user
    // password check 
    // access and refresh token generation 
    // send and set the tokens into cookies

    const {
        email,
        password,
        username
    } = req.body;

    if (!username || !email) {
        throw new apiError(400, "Username or Paassword is required.");
    };

    const user = await UserModel.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new apiError(404, "User does not exists with this username or email")
    };

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
       throw new apiError(401, "Invalid user credentials!") 
    };

    await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = UserModel.findById(user_id).select("-password -refreshToken");

    // cookies only modifiable from the server not from the frontend.
    const options = {
        httpOnly: true,
        secure: true
    };

    // setting access and refresh tokens to the cookies.
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged in Successfully!"
        )
    )
});


const logoutUser = asyncHandler(async (req, res) => {
    // clear refresh and access token cookies.
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new apiResponse(200, {}, "User logged out successfully."))
    
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};