import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import doctorModel from "../models/doctor.Model.js"; 
import jwt from "jsonwebtoken";
import { json } from "express";
import appointmentModel from "../models/appointment.Model.js";



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
            address: JSON.parse(address),
            date: Date.now()
        };
      
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(201).json(new ApiResponse(201, newDoctor, "Doctor Added Successfully"));
    } catch (error) {
        console.error("Error adding doctor:", error);
        return res.json(new ApiError(500,error.message));
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
        return res.json(new ApiError(500, "Internal Server Error", error.message));
    }
});
    
//Api to get all doctors list for panel
const getAllDoctors = asyncHandler(async (req, res, next) => {
    try {

        const doctors = await doctorModel.find({}).select("-password");
        res.json(new ApiResponse(200, doctors, "Doctors fetched successfully"));

    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json(new ApiError(500,error.message));
        
    }
})

//api to get all the appointements for admin panel

const appointmentsAdmin = asyncHandler(async (req, res, next) => {
    try {
        const appointments = await appointmentModel.find({}).populate('doctorId').populate('userId').sort({slotDate: -1, slotTime: -1});
        res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.json(new ApiError(500,error.message));
    }
})

//api to cancel the appointment by admin


 const appointmentCancel = asyncHandler(async (req, res) => {
  try {
    
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new ApiError(404, "Appointment not found");
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release the doctor slot
    const { doctorId, slotDate, slotTime } = appointmentData;   // ✅ FIXED (was docId)
    const doctorData = await doctorModel.findById(doctorId);
    if (!doctorData) {
      throw new ApiError(404, "Doctor not found");
    }

    let slots_booked = doctorData.slots_booked || {};
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });

    return res.json(new ApiResponse(200, {}, "Appointment Cancelled Successfully"));
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(500, error.message));
  }
});

export { addDoctor, loginAdmin,getAllDoctors, appointmentsAdmin,appointmentCancel };