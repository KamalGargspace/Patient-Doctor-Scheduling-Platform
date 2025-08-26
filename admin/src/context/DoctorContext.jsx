import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const [appointments, setAppointments] = useState([]);

  const [dashData, setDashData] = useState(false);

  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/doctor/appointments",
        { headers: { dToken } }
      );
      if (response.data?.success) {
        setAppointments(response.data?.data);
        //  console.log("Appointments fetched successfully");
        console.log(response.data?.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch appointments");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (response.data?.success) {
        toast.success("Appointment marked as completed");
        getAppointments();
      } else {
        toast.error(
          response.data?.message || "Failed to mark appointment as completed"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to mark appointment as completed");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (response.data?.success) {
        toast.success("Appointment marked as cancelled");
        getAppointments();
      } else {
        toast.error(
          response.data?.message || "Failed to mark appointment as completed"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to mark appointment as completed");
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (response.data?.success) {
        setDashData(response.data?.data);
        console.log(response.data?.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch dashboard data");
    }
  };

  const getProfileData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (response.data?.success) {
        setProfileData(response.data?.data);
        console.log(response.data?.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch profile data");
    }
  };
  const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashboardData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
