require("dotenv").config();

const app = require('./src/app');
const dbConnect = require('./src/config/db');
const PORT = process.env.SERVER_PORT || 8000;

;(async () => {
    
    try {

        // database connection :
        await dbConnect();

        app.on('error', (error) => {
            console.log("server error :", error.message);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });

    } catch (error) {
        console.log("server error :", error.message);
        throw error;
    }

})();
