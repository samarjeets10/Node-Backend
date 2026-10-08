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

        const response = await cloudinary.UploadStream.upload(localFilePath, {
            resource_type: "auto"
        });

        // file uploaded successfully :

        console.log("file is uploaded successfully.", response.url);

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload option got failed.
        return null;
    }
}


module.exports = uploadOnCloudinary;