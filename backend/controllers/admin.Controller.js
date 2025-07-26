import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import doctorModel from "../models/doctor.Model.js"; 
import jwt from "jsonwebtoken";
import { json } from "express";



// api for adding doctor

const addDoctor = asyncHandler(async (req, res, next) => {

    try {
        const { name , email , password ,speciality, degree , experience , about , fees , address} = req.body;
        const imageFile = req.file;

        console.log({name, email, password,speciality, degree, experience, about, fees, address, imageFile});

        //checking for all data to add the doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            throw new ApiError(400, "Some Details are missing");
        }

        //validating the email format

        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Invalid Email Format");
        }
        //validating the strong password
        if(password.length < 8) {
            throw new ApiError(400, "Password must be at least 8 characters long");
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //uploading the image to cloudinary

        const imageUpload = await uploadOnCloudinary(imageFile.path);
        const imageUrl = imageUpload ? imageUpload.secure_url : "";


        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date: Date.now()
        };
      
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json(new ApiResponse(201, "Doctor Added Successfully", newDoctor));
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.json(new ApiError(500, "Internal Server Error", error.message));
    }
})

const loginAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
//         console.log("Provided:", email, password);
// console.log("Expected:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign( {email} , process.env.JWT_SECRET_KEY,{ expiresIn: process.env.JWT_EXPIRATION });
            return res.status(200).json(new ApiResponse(200, { token }, "Login successful"));
        }
        else {
            return res.status(401).json(new ApiError(401, "Invalid credentials"));
        }
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.json(new ApiError(500, "Internal Server Error", error.message));
    }
});
    



export { addDoctor, loginAdmin };