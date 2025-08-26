import express,{Router} from "express";
import { appointementsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from "../controllers/doctor.Controller.js";
import authDoctor from "../middlewares/authDoctor.Middleware.js";

const doctorRouter = Router();


doctorRouter.route('/list').get(doctorList);
doctorRouter.route('/login').post(loginDoctor)
doctorRouter.route('/appointments').get(authDoctor,appointementsDoctor)
doctorRouter.route('/complete-appointment').post(authDoctor,appointmentComplete)
doctorRouter.route('/cancel-appointment').post(authDoctor,appointmentCancel)
doctorRouter.route('/dashboard').get(authDoctor,doctorDashboard)
doctorRouter.route('/profile').get(authDoctor,doctorProfile)
doctorRouter.route('/update-profile').post(authDoctor,updateDoctorProfile)


export default doctorRouter;