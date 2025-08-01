import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {

  const {docId} = useParams();
  const {doctors,currencySymbol} = useContext(AppContext);

  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

 const [docInfo,setDocInfo] = useState(null);
 const [docSlots,setDocSlots] = useState([]);
 const [slotIndex,setSlotIndex] = useState(0);
 const [slotTime, setSlotTime] = useState('')
  
 
 const fetchDocInfo = async()=>{
    const docInfo = doctors.find((doc)=>doc._id === docId)
    setDocInfo(docInfo);
  }


  const getAvailableSlots = async()=>{
     setDocSlots([])


     //getting current Date
     let today = new Date()

     for(let i = 0;i<7 ;i++){
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate()+i)



      //setting end Time of date with index
      let endTime = new Date();
      endTime.setDate(today.getDate()+i);
      endTime.setHours(18,0,0,0);

      //setting hours

      if(today.getDate()=== currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>11 ? currentDate.getHours()+1: 11);
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      }
      else{
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while(currentDate<endTime){
        let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit', hour12:true});

        //add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        //incrementing time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes()+30);
      }

      if (timeSlots.length > 0) {
      setDocSlots((prev) => [...prev, timeSlots]);
    }
     }

  }


  useEffect(()=>{
    fetchDocInfo();
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots);
  },[docSlots])

  // console.log(docInfo);

  return docInfo && (
    <div>
      {/* {----------Doctor Details ----------------} */}
      <div className='flex flex-col sm:flex-row gap-4 '>
        <div>
          <img className='bg-primary-custom w-full sm:max-w-72 rounded-lg' src = {docInfo.image} />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* {---------Doc Info _-------------------} */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon}/>
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* {-------Doc About------------------------} */}

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>

        </div>
      </div>


      {/* {----------Doctor Slots ----------------} */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x -scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary-custom text-white' : 'border border-gray-200'}`} key = {index}>
                   <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                   <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>

            ))
          }
        </div>

        <div className='flex items-center gap-3 mt-4 w-full overflow-x-scroll'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime?'bg-primary-custom text-white':'text-gray-400 border border-gray-300'}`}key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button className='bg-primary-custom text-white text-sm font-light py-3 px-14 rounded-full my-6'>Book an appointment</button>  
      </div>

      {/* {----------Listing Related Doctors----------------} */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docInfo._id}/>
      
    </div>
  )
}

export default Appointment
