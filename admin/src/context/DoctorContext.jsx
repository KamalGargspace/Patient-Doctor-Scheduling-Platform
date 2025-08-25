import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken,setDToken] =  useState(localStorage.getItem("dToken")?localStorage.getItem("dToken"):"");

    const [appointments,setAppointments] = useState([])

    const getAppointments = async()=>{
           try {
            
            const response = await axios.get(backendUrl+'/api/doctor/appointments',{ headers :{dToken},});
            if(response.data?.success){
             setAppointments(response.data?.data);
            //  console.log("Appointments fetched successfully");
            //  console.log(response.data?.data);
            }
            else{
             toast.error(response.data?.message || "Failed to fetch appointments");
            }
           } catch (error) {
              console.log(error)
              toast.error(error.message || "Failed to fetch appointments");
           }

    }
    const value = {
        backendUrl,
        dToken,setDToken,
        appointments,setAppointments,
        getAppointments
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
}

export default DoctorContextProvider;
