import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  console.log("Cloudinary connected");
};

const uploadOnCloudinary = async (filePath) => {
    try{
           if(!filePath) {
               return null;
           }
           const response = await cloudinary.uploader.upload(filePath,{
            resource_type: "image"
           })
           //file has been uploaded to cloudinary
        //    console.log("File uploaded successfully to Cloudinary",response.url);
        // console.log("cloudingary response:", response);
         fs.unlinkSync(filePath);

           return response;
    }
    catch(error)
    {
        fs.unlinkSync(filePath); // delete the file from local storage as upload failed
        return null;
    }
}    

export default connectCloudinary;
export { uploadOnCloudinary };
