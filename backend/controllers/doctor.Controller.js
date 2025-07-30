import doctorModel from "../models/doctor.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const changeAvailability = asyncHandler(async (req, res, next) => {
    try {
        const {docId} = req.body
        const doctorData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !doctorData.available });
        res.json(new ApiResponse(200, "Doctor availability changed successfully"));
    } catch (error) {
        console.error("Error in changeAvailability:", error);
        return  res.json(new ApiError(500, "Internal Server Error"));
    }
})

const doctorList = asyncHandler(async (req, res, next) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-__v','-email']);
        return res.json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
    } catch (error) {
        console.error("Error in doctorList:", error);
        return  res.json(new ApiError(500, error.message));
    }
})


export {changeAvailability, doctorList}