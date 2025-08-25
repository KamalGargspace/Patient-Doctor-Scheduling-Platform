import express,{Router} from "express";
import { appointementsDoctor, doctorList, loginDoctor } from "../controllers/doctor.Controller.js";
import authDoctor from "../middlewares/authDoctor.Middleware.js";

const doctorRouter = Router();


doctorRouter.route('/list').get(doctorList);
doctorRouter.route('/login').post(loginDoctor)
doctorRouter.route('/appointments').get(authDoctor,appointementsDoctor)


export default doctorRouter;