require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});