import express, { Router } from "express";
import { bookAppointment, cancelAppointment, getAppointments, getUserProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateUserProfile, verifyRazorpay } from "../controllers/user.Controller.js";
import authUser from "../middlewares/authUser.Middleware.js";
import upload from "../middlewares/multer.Middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/get-profile").get(authUser,getUserProfile);
userRouter.route("/update-profile").post(upload.single("image"), authUser, updateUserProfile);
userRouter.route("/book-appointment").post(authUser, bookAppointment);
userRouter.route("/get-appointments").get(authUser, getAppointments);
userRouter.route("/appointments").get(authUser, listAppointment);
userRouter.route("/cancel-appointment").post(authUser,cancelAppointment)
userRouter.route("/payment-razorpay").post(authUser,paymentRazorpay)
userRouter.route("/verifyRazorpay").post(authUser,verifyRazorpay)



export default userRouter;