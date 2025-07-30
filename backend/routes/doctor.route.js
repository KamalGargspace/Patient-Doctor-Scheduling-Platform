import express,{Router} from "express";
import { doctorList } from "../controllers/doctor.Controller.js";

const doctorRouter = Router();


doctorRouter.route('/list').get(doctorList);


export default doctorRouter;