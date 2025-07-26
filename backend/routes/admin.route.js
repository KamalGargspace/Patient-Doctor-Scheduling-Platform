import express, { Router } from "express";
import { addDoctor,loginAdmin } from "../controllers/admin.Controller.js";
import upload from "../middlewares/multer.Middleware.js";
import authAdmin from "../middlewares/authAdmin.Middleware.js";

const adminRouter = Router();

adminRouter.route("/add-doctor").post(authAdmin,upload.single("image"), addDoctor);
adminRouter.route("/login").post(loginAdmin);

export default adminRouter;
