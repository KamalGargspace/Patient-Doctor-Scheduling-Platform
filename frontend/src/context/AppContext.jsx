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
  useEffect(() => {
    getDoctorsData();
  }, []);
  const value = {
    doctors,
    currencySymbol,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
