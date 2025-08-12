import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const [userData,setUserData] = useState(false)


  const getDoctorsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/doctor/list");
      console.log("Doctors Data:", response.data);
      if (response.data?.success) {
        setDoctors(response.data?.data);
        console.log("Doctors Data Set Successfully");
      } else {
        console.error("Failed to fetch doctors:", response.data?.message);
        toast.error(response.data?.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.log("Error fetching doctors:", error);
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const loadUserProfileData = async()=>{
    try {
      const response = await axios.get(backendUrl +"/api/user/get-profile",{headers: {token}});
      console.log("User Profile Data:", response.data);
      if (response.data?.success) {
        setUserData(response.data?.data);
        console.log("User Profile Data Loaded Successfully");
      } else {
        console.error("Failed to load user profile:", response.data?.message);
        toast.error(response.data?.message || "Failed to load user profile");
      }
    } catch (error) {
      console.error("Error loading user profile data:", error);
      toast.error(error.response?.data?.message || "Failed to load user profile");
      
    }
  }
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if(token) {
      loadUserProfileData();
    }
    else{
      setUserData(false);
    }
  },[token]);
  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
