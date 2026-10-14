const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            trim: true,
            unique: true
        },

        email: {
            type: String,
            require: [true, "Email is required"],
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true
        },

        role: {
            type: String,
            required: true,
            enum: ["admin", "manager", "user"]
        }
    }, 

    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;