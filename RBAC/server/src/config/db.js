const mongoose = require('mongoose');

const dbConnect = async () => {

    try {
        const connect = await mongoose.connect(process.env.DBCONNECTION_STRING);
        console.log(`Database connected : ${connect.connection.host}, ${connect.connection.name}`);

    } catch (error) {
        console.log("Error : Failed to connect Database", error.message);
        process.exit(1);
    }

};

module.exports = dbConnect;

