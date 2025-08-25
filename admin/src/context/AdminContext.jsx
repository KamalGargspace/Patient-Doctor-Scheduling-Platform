import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken")?localStorage.getItem("accessToken"):"");
  const [doctors, setDoctors] = useState([]);
  const [appointments,setAppointments] = useState([])
  const [dashData,setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
  const getAllDoctors = async () => {
     try {
        const response = await axios.post(backendUrl + "/api/admin/all-doctors", {}, {
          headers: { access_token: accessToken },
        })
        console.log("Get All Doctors Response:", response);
        console.log("Get All Doctors Data:", response.data?.data);
        

        if(response.data?.success){
            setDoctors(response.data?.data);
        }
        else{
          toast.error(response.data?.message || "Failed to fetch doctors");
        }
     } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
     }
  }

const changeAvailability = async (docId) => {
     try {
          const response = await axios.post(backendUrl + "/api/admin/change-availability", { docId }, {
          headers: { access_token: accessToken },
        })
        console.log("changeAvailability Response:", response);
        console.log("changeAvailability Data:", response.data?.data);

        if(response.data?.success){
            toast.success(response.data?.message || "Doctor availability changed successfully");
            // Update the local state to reflect the change
            getAllDoctors();
        }
        else{
          toast.error(response.data?.message || "Failed to fetch doctors");
        }
     } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Failed to change availability");
     }
}


const getAllAppointments = async()=>{
     try {
         const response = await axios.get(backendUrl + "/api/admin/appointments", {
          headers: { access_token: accessToken }})

          if(response.data?.success){
              setAppointments(response.data?.data);
              console.log("Appointments Data:", response.data?.data);
          }
          else{
              toast.error(response.data?.message || "Failed to fetch appointments");
          }
     } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.response?.data?.message || "Failed to fetch appointments");
     }
}

const cancelAppointment = async(appointmentId) =>{
    try {
        console.log(appointmentId)

        const response = await axios.post(backendUrl + "/api/admin/cancel-appointment",{appointmentId},{headers:{access_token:accessToken}})
        // console.log("Cancel Response:", response.data);

        if(response.data?.success){
          toast.success(response.data?.message)
          getAllAppointments()
          // getAllDoctors()
        }
        else{
          toast.error(response?.data?.message || "Failed to cancel appointment")
        }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment")
    }
  }
  const getDashboardData = async()=>{
    try {
        const response = await axios.get(backendUrl + "/api/admin/dashboard", {
            headers: { access_token: accessToken }
        });

        if (response.data?.success) {
            setDashData(response.data?.data);
            console.log("Dashboard Data:", response.data?.data);
        } else {
            toast.error(response.data?.message || "Failed to fetch dashboard data");
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  }
  const value = {
    accessToken,
    setAccessToken,
    backendUrl,doctors,getAllDoctors,
    changeAvailability,
    appointments,getAllAppointments,
    setAppointments,
    cancelAppointment,
    getDashboardData,
    dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
