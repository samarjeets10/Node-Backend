const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
    try {

        const connectionInstance = await mongoose.connect(MONGODB_URI);
        console.log(`Database Connected !! DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection error! ", error);
        process.exit(1);
    }
};

module.exports = connectDB;