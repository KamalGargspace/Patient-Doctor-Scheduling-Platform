import userModel from "../models/user.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Some Details are missing");
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid Email Format");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already registered");
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    return res.status(201).json(
      new ApiResponse(201, { token }, "User Registered Successfully")
    );
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.json(new ApiError(500, error.message));
  }
});
//api for user login 

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    
      const {email,password} = req.body;
      const user = await userModel.findOne({email});
      if(!user) {
          throw new ApiError(404, "User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(isMatch){
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_EXPIRATION});
        return res.json(new ApiResponse(200, { token }, "Userr Logged In Successfully"));
      }
      else{
        throw new ApiError(401, "Invalid credentials");
      }

  } catch (error) {
    console.error("Error in login User:", error);
    return res.json(new ApiError(500, error.message));
  }
})
//api to get the user profile data

const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
       const userId = req.userId;
       const userData = await userModel.findById(userId).select(['-password', '-__v']);
       res.json(new ApiResponse(200, userData, "User profile fetched successfully"));
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.json(new ApiError(500, error.message));
  }
})

//API to update user profile data
const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.userId;
    const {name,phone,address,dob,gender} = req.body;
    const imageFile = req.file;
    if(!name|| !phone || !dob || !gender){
      throw new ApiError(400, "Some Details are missing");
    }
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    await userModel.findByIdAndUpdate(userId, {name,phone,address:parsedAddress,dob,gender});
    if(imageFile) {
      const imageUpload = await uploadOnCloudinary(imageFile.path);
      const imageUrl = imageUpload ? imageUpload.secure_url : "";
      await userModel.findByIdAndUpdate(userId, {image: imageUrl});
    }

    return res.json(new ApiResponse(200, {}, "User profile updated successfully"));

  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return res.json(new ApiError(500, error.message));
    
  }
})
export { registerUser,loginUser, getUserProfile,updateUserProfile };
