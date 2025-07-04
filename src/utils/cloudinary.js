import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file as been uploaded successfully
        console.log("File uploaded successfully on cloudinary",response.url);
        // fs.unlink(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temperory file as the upload file operation failed
        return null;
    }
}
export {uploadOnCloudinary};


