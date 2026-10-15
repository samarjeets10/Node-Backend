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


        // check the user is already exists :
        const existedUser = await UserModel.findOne({
            $or: [{ username, email }]
        })


        if (existedUser) {
            console.log("user is already exists with this usename or password!");
            throw new Error;
        }

        // hash passwors :

        const hashedPassword = await bcrypt.hash(password, 10);

        // creating new user and saving it in the database:
        const newUser = new User({ username, email, password: hashedPassword, role });

        //or:

        // const user = await UserModel.create({
        //     username: username.toLowerCase(),
        //     email,
        //     password,
        //     role
        // })

        await newUser.save();

        return res.status(201).json({
            message: `User registered successfully : user : ${username}`
        });



    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Somethig went wrong while creating the entry in database!!"
        });
    }

}

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

        const isPassworsMatch = await bcrypt.compare(password, user.passowrd);

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