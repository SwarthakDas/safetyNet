import {v2 as cloudanary} from "cloudinary";
import fs from "fs";

cloudanary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploaOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response=await cloudanary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File is uploaded in coloudinary",response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploaOnCloudinary}