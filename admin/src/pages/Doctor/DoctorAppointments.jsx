import React, { use, useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
    const {dToken,appointments,getAppointments} = useContext(DoctorContext);

    useEffect(()=>{
        if(dToken){
            getAppointments();
        }
    },[dToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p>All Appointments</p>
      <div>
        <div>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
