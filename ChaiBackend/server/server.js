require('dotenv').config();
// require('dotenv').config({path: './env'});

/*
    while using the import module syntax :

    dotenv.config({
        path: './env'
    })
*/

const app = require('./src/app');
const connectDB = require('./src/config/db');
const connectionInstance = require('./src/config/db');

const PORT = process.env.SERVER_PORT || 8000;

;( async () => {

    try {

        connectDB();

        app.on('error', (error) => {
            console.log('Error: ', error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}.`);
        });

    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }

})();


// IIFE-approach for the database connection and server running.

/*( async () => {
    try {

        await mongoose.connect(MONGODB_URI);
        console.log("Database connected successfully!");

        app.on("error", (error) => {
            console.log("Error: ", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Server is running ${PORT}`);
        });

    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})();*/