const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const apiError = require('../utils/apiError');
const apiResponse = require('../utils/apiResponse');
const UserModel = require('../models/user.model');

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const {
        username
    } = req.params;

    if (!username?.trim()) {
        throw new apiError(400, "User name is missing!");
    }

    const channel = await UserModel.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        }, 

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers" // stores info in this array
            }
        },

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo" // stores info in this array
            }
        },

        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers" // subscribers count
                },

                channelsSubscribedToCount: {
                    $size: "$subscribedTo" // channels count
                },

                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);


    if (!channel?.length) {
        throw new apiError(400, "Channel does no exists");
    }

    return res.status(200).json(new apiResponse(200, channel[0], "User channel fetched successfully."));

});


const getWatchHistory = asyncHandler (async (req, res) => {

    const user = await UserModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            },
        },

        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                // nested aggrigate lookups just like a nested querying.
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",

                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addField: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json(new apiResponse(
        200,
        user[0].watchHistory,
        "Watched History fetched successfully."
    ))
});


module.exports = {
    getUserChannelProfile,
    getWatchHistory
}