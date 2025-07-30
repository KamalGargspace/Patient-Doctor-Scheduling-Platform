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
  try {
    if (!filePath) return null;

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    // ✅ Delete temp file safely if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // ✅ Safe delete only if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export default connectCloudinary;
export { uploadOnCloudinary };