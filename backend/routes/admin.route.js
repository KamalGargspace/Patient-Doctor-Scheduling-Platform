import express, { Router } from "express";
import { addDoctor,getAllDoctors,loginAdmin } from "../controllers/admin.Controller.js";
import upload from "../middlewares/multer.Middleware.js";
import authAdmin from "../middlewares/authAdmin.Middleware.js";
import { changeAvailability } from "../controllers/doctor.Controller.js";

const adminRouter = Router();

adminRouter.route("/add-doctor").post(authAdmin,upload.single("image"), addDoctor);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/all-doctors").post(authAdmin,getAllDoctors);
adminRouter.route("/change-availability").post(authAdmin,changeAvailability);

export default adminRouter;
