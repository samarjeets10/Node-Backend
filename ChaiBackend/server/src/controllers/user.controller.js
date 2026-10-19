const asyncHandler = require("../utils/asyncHandler");
const { apiError } = require("../utils/apiError");
const { apiResponse } = require('../utils/apiResponse');
const UserModel =  require('../models/user.model');
const uploadOnCloudinary = require('../utils/cloudinary');


const getCurrentUser = asyncHandler(async (req, res) => {
    
    return res.status(200).json(200, req.user, "current user fecteched successfully.");

});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const {
        fullName,
        email
    } = req.body;


    if (!fullName || !email) {
        throw new apiError(400, "All fields are required.")
    }


    const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password");


    return res.status(200).json(
        new apiResponse(200, user, "Account details updated successfully")
    );

});


const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing.");
    }

    const avatar = await  uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new apiError(400, "Error while uploading on avatar");
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new apiResponse(200, user, "Avatar updated successfully")
    );

});


const updateUserCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover image is missing.")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new apiError(400, "Error while uploading on cover image.");
    }

    const  user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },

        { new: true }
    ).select("-password");

    return res.status(200).json(
        new apiResponse(200, user, "Cover Image updated successfully")
    );

})


module.exports = {
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}