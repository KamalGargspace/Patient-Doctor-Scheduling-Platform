import userModel from "../models/user.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.Model.js";
import appointmentModel from "../models/appointment.Model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import Razorpay from "razorpay";

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
const bookAppointment = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { docId, slotDate, slotTime } = req.body;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }
    if (!doctor.available) {
      throw new ApiError(400, "Doctor is not available for appointment");
    }

    let slots_booked = doctor.slots_booked || {};
    slots_booked[slotDate] = slots_booked[slotDate] || [];
    if (slots_booked[slotDate].includes(slotTime)) {
      throw new ApiError(400, "Slot already booked");
    }
    slots_booked[slotDate].push(slotTime);

    const appointment = await appointmentModel.create({
      userId,
      doctorId: docId,
      amount: doctor.fees,
      slotTime,
      slotDate,
    });

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json(new ApiResponse(200, appointment, "Appointment booked successfully"));
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
});
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel
    .find({ userId: req.userId })
    .populate('doctorId', 'name speciality fees') // only needed fields
    .populate('userId', 'name email phone');

  res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

//API to get all appointments for frontend my-appointments page
 const listAppointment = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel
      .find({ userId })
      .populate('doctorId', 'name speciality fees image address')
      .sort({ createdAt: -1 }); // sort by most recent first

      return res.json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
  } catch (error) {
    console.error("Error in listAppointment:", error);
    return res.json(new ApiError(500, error.message));
    
  }
 })


 const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new ApiError(404, "Appointment not found");
    }

    // Verify user
    if (appointmentData.userId.toString() !== userId.toString()) {
      throw new ApiError(400, "Unauthorized action");
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

const razorpayInstance = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})
//api to make payment of appointment using razorpay

const paymentRazorpay = asyncHandler(async (req, res, next) => {
  try {
    const {appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if(!appointmentData){
      throw new ApiError(404, "Appointment not found");
    }
    if(appointmentData.cancelled){
      throw new ApiError(400, "Cannot pay for a cancelled appointment");
    }
    //CREATING OPTION FOR THE RAZORPAY INSTANCE
    const options={
      amount: appointmentData.amount * 100, //amount in paisa
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }

    const order = await razorpayInstance.orders.create(options);

    return res.json(new ApiResponse(200, order, "Razorpay order created successfully"));
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(500, error.message));
  }
})

//api to verify the payment made by razorpay
const verifyRazorpay = asyncHandler(async (req, res, next) => {
  try {

    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    // console.log("Order Info:", orderInfo);

    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true});
      return res.json(new ApiResponse(200, {}, "Payment verified and appointment marked as paid"));
    }

    else{
      throw new ApiError(400, "Payment not verified");
    }

    
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(500, error.message));
  }
})
export { registerUser,loginUser, getUserProfile,updateUserProfile, bookAppointment,getAppointments,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay };
