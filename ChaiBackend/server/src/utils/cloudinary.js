const cloudinary = require('cloudinary');
const fs = require('fs');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded successfull", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temperory file as the upload opeeation got failed.
        return null;
    }
}

module.exports = uploadOnCloudinary;