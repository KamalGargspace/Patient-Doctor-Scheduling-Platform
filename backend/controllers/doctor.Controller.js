import appointmentModel from "../models/appointment.Model.js";
import doctorModel from "../models/doctor.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = asyncHandler(async (req, res, next) => {
  try {
    const { docId } = req.body;
    const doctorData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });
    res.json(new ApiResponse(200, "Doctor availability changed successfully"));
  } catch (error) {
    console.error("Error in changeAvailability:", error);
    return res.json(new ApiError(500, "Internal Server Error"));
  }
});

const doctorList = asyncHandler(async (req, res, next) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select(["-password", "-__v", "-email"]);
    return res.json(
      new ApiResponse(200, doctors, "Doctors fetched successfully")
    );
  } catch (error) {
    console.error("Error in doctorList:", error);
    return res.json(new ApiError(500, error.message));
  }
});

//api for the doctor login thing

const loginDoctor = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = await jwt.sign(
        { id: doctor._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json(new ApiResponse(200, { token }, "Login successful"));
    } else {
      throw new ApiError(401, "Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(error.statusCode || 500, error.message));
  }
});

//api to get the doctor appointments for doctor panel
const appointementsDoctor = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const appointments = await appointmentModel
      .find({ doctorId })
      .populate("doctorId")
      .populate("userId");

    return res.json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});

//api to mark the appointment completed for the doctor

const appointmentComplete = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json(
        new ApiResponse(200, appointmentData, "Appointment marked as completed")
      );
    } else {
      return res.json(
        new ApiError(404, "Appointment not found or you are not authorized")
      );
    }
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});

//api to mark the appointment cancel for the doctor

const appointmentCancel = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.doctorId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json(
        new ApiResponse(200, appointmentData, "Appointment marked as cancelled")
      );
    } else {
      return res.json(new ApiError(404, "Cancelled failed"));
    }
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});

//api to get the dashboard data for the doctor
const doctorDashboard = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const appointments = await appointmentModel
      .find({ doctorId })
      .populate("userId")
      .populate("doctorId");

    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId._id)) {
        patients.push(item.userId._id);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    return res.json(
      new ApiResponse(200, dashData, "Dashboard data fetched successfully")
    );
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});

//api to get the doctorprofile

const doctorProfile = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;

    const ProfileData = await doctorModel
      .findById(doctorId)
      .select(["-password", "-__v"]);
    return res.json(
      new ApiResponse(200, ProfileData, "Doctor profile fetched successfully")
    );
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});

//api to update the doctor profile

const updateDoctorProfile = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { available, address, fees } = req.body;

    await doctorModel.findByIdAndUpdate(doctorId, { available, address, fees });

    return res.json(
      new ApiResponse(200, null, "Doctor profile updated successfully")
    );
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      )
    );
  }
});
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointementsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
