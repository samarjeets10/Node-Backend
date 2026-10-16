const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
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
            default: "user",
            enum: ["admin", "manager", "user"]
        }
    }, 

    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;