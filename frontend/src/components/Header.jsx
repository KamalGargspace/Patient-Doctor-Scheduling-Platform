import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary-custom rounded-lg px-6 md:px-10 lg:px-20 text-left'>
      {/* --------------------left side ---------------------*/}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] '>
         <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book Appointment<br /> With Trusted Doctors
         </p>
         <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
             <img className='w-25' src={assets.group_profiles} alt=""/>
             <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block'/>
schedule your appointment hassle-free</p>
         </div>
         <a href='#speciality' className='flex items-center bg-white gap-2 px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
               Book appointment <img className='w-3' src={assets.arrow_icon} alt=""/>
         </a>
      </div>
       {/* --------------------right side ---------------------*/}
      <div className='md:w-1/2 relative'>
           <img className ='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt=""/>
      </div>
    </div>
  )
}

export default Header
