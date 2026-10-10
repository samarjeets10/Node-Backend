const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true  // serching field.
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String, // cloudnary url
            required: true,
        },

        coverImage: {
            type: String, //cloudnaer url
        },

        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        password: {
            type: String,
            required: [true, "Password is required."],
        },

        refreshToken: {
            type: String
        }
    },

    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
});

// custom methods :

// Password comparison or verification agenst saved hashed password from the database.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);   // compares the entered passwor d and the stored hashed passowrd/hash value.
};

// Generating Access tokens:

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

// Generate Refresh tokens:

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};


const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;