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


        const existedUser = await UserModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return res.status(409).json({
                message: "User already exists with this username or email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, email, password: hashedPassword, role });

        await newUser.save();

        return res.status(201).json({
            message: `User registered successfully: ${username}`
        });
        
    } catch (error) {
        console.error("Failed to register user:", error);
    }
};

const loginUser = async (req, res) => {

    try {
          const {
            email,
            password,
            username
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

        return res.status(200).json({
            message: "User loggedin successfully.",
            token
        })


    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}