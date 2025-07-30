import express, { Router } from "express";
import { registerUser } from "../controllers/user.Controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);

export default userRouter;