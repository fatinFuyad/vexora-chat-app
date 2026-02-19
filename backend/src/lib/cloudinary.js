import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export default cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Uploads an image file
export const uploadImage = async function(imagePath, folder) {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: `chatApplication/${folder || "images"}`
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    // console.log(result);
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};
