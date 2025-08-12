import express, { Router } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/user.Controller.js";
import authUser from "../middlewares/authUser.Middleware.js";
import upload from "../middlewares/multer.Middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/get-profile").get(authUser,getUserProfile);
userRouter.route("/update-profile").post(upload.single("image"), authUser, updateUserProfile);

export default userRouter;