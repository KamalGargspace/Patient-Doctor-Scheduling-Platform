import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken")?localStorage.getItem("accessToken"):"");
  const [doctors, setDoctors] = useState([]);

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
  
  const value = {
    accessToken,
    setAccessToken,
    backendUrl,doctors,getAllDoctors,
    changeAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
