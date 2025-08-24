import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([])

  const navigate = useNavigate();

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate)=>{
    const dateArr = slotDate.split('_')

    return dateArr[0] + " " + months[Number(dateArr[1])-1] + " " + dateArr[2]
  }

  const getUserAppointments = async () => {
    try {

      //  console.log("Fetching appointments with token:", token);
      const response = await axios.get(backendUrl+"/api/user/appointments",{headers:{token}});
      // console.log(response);
      if(response.data?.success){
        setAppointments(response.data?.data);
        console.log(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");

    }
  }

  const cancelAppointment = async(appointmentId) =>{
    try {
        // console.log(appointmentId)

        const response = await axios.post(backendUrl + "/api/user/cancel-appointment",{appointmentId},{headers:{token}})
        console.log("Cancel Response:", response.data);

        if(response.data?.success){
          toast.success(response.data?.message)
          getUserAppointments()
          getDoctorsData()
        }
        else{
          toast.error(response?.data?.message || "Failed to cancel appointment")
        }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment")
    }
  }

  const initPay = (order)=>{
   const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Appointment Payment',
    decription:'Appointment Payment',
    receipt: order.receipt,
    order_id: order.id,
    handler: async(response)=>{
       console.log(response)
      
      try {
        const resp = await axios.post(backendUrl + "/api/user/verifyRazorpay",response,{headers:{token}})
        if(resp.data?.success){
          toast.success(resp.data?.message)
          getUserAppointments()
          navigate('/my-appointments')
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Payment verification failed")

      }

    }
   }

   const rzp = new window.Razorpay(options)
   rzp.open()
  }

  const appointmentRazorpay = async(appointmentId)=>{
    try {
      const response = await axios.post(backendUrl + "/api/user/payment-razorpay",{appointmentId},{headers:{token}})
      if(response.data?.success){
        console.log("Razorpay Order:", response.data?.data);
        initPay(response.data?.data)
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to pay for appointment")
    }
  }

  useEffect(()=>{
    if(token){
      getUserAppointments();
      // console.log(token);
    }
  },[token])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.doctorId.image}/>
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold '>{item.doctorId.name}</p>
                <p>{item.doctorId.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.doctorId.address.line1}</p>
                <p className='text-xs'>{item.doctorId.address.line2}</p>
                <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time :</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>

              <div>

              </div>

              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50 '>Paid</button>}
               {!item.cancelled && !item.payment && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary-custom hover:text-white transition-all duration-300'>Pay Online</button>} 
                {!item.cancelled && <button onClick= {()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>Appointemnt Cancelled</button>}
              </div>

            </div>

          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
