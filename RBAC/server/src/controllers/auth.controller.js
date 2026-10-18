const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

    try {
        
        const {
            username,
            email,
            password,
            role
        } = req.body;


        if (!username || !email || !password || !role) {
            return res.status(400).json({
                message: "All credentials are required."
            })
        }

        // only allow user and manager role during registration

        if (!["user", "manager"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role . choose either user or manager."
            });
        }


        const existedUser = await UserModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return res.status(409).json({
                message: "User already exists with this username or email."
            });
        }

        // password hasing :
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user with the selected role
        const newUser = new UserModel({ username, email, password: hashedPassword, role });

        await newUser.save();

        return res.status(201).json({
            message: `User registered successfully: ${username}`,
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
        
    } catch (error) {
        console.error("Failed to register user:", error);

        return res.status(500).json({
            message: "Failed to regester user."
        })
    }
};

const loginUser = async (req, res) => {

    try {
          const {
            email,
            password,
            username,
        } = req.body;

        const user = await UserModel.findOne({
            $or: [{ username }, { email }]
        })


        if (!user) {
            return res.status(404).json({
                message: "user with this credentials not found!!"
            })
        }

        // compare the password with the hased password :

        const isPassworsMatch = await bcrypt.compare(password, user.password);

        if (!isPassworsMatch) {
            return res.status(400).json({
                message: "Invalid user credentials."
            })
        };

        // jwt token generation and giving to the user:

        const token = await jwt.sign(
            {
                id: user._id,
                role: user.role
            },

            process.env.ACCESS_TOKEN_SECRET,

            {
                expiresIn: "1h"
            }

        );


        // store jwt in the http-only cookie

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });


        return res.status(200).json({
            message: "User loggedin successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })


    } catch (error) {
        console.log("Login failed :", error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}


const logoutUser = (req, res) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    return res.status(200).json({
        message: "Logged out successfully."
    });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser
}