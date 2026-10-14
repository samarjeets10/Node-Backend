const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

    const {
        username, 
        email, 
        password,
        role
    } = req.body;



}

const loginUser = async (req, res) => {

}

module.exports = {
    registerUser,
    loginUser
}