import React from 'react'
import { assets } from '../assets/assets'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='w-full bg-white border-t border-gray-100 mt-32 pt-12 px-6 md:px-10 lg:px-16 xl:px-24 text-sm text-gray-600'>

      {/* Top Grid */}
      <div className='grid gap-10 lg:grid-cols-[2fr_1fr_1fr_2fr]'>
        
        {/* Brand Section */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="logo" />
          <p className='max-w-md leading-6'>
            Prescripto helps you connect with the best doctors near you with an easy appointment system. Your health, our priority.
          </p>
          <div className='flex gap-4 mt-5'>
            <FaFacebookF className='cursor-pointer hover:text-primary-custom transition' />
            <FaTwitter className='cursor-pointer hover:text-primary-custom transition' />
            <FaLinkedinIn className='cursor-pointer hover:text-primary-custom transition' />
            <FaInstagram className='cursor-pointer hover:text-primary-custom transition' />
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <p className='text-lg font-semibold text-gray-800 mb-4'>COMPANY</p>
          <ul className='flex flex-col gap-2'>
            <NavLink 
              to='/' 
              onClick={scrollToTop} 
              className={({ isActive }) => isActive ? 'text-primary-custom' : 'hover:text-primary-custom'}
            >
              Home
            </NavLink>
            <NavLink 
              to='/about' 
              onClick={scrollToTop} 
              className={({ isActive }) => isActive ? 'text-primary-custom' : 'hover:text-primary-custom'}
            >
              About Us
            </NavLink>
            <NavLink 
              to='/contact' 
              onClick={scrollToTop} 
              className={({ isActive }) => isActive ? 'text-primary-custom' : 'hover:text-primary-custom'}
            >
              Contact
            </NavLink>
            <NavLink 
              to='/privacy' 
              onClick={scrollToTop} 
              className={({ isActive }) => isActive ? 'text-primary-custom' : 'hover:text-primary-custom'}
            >
              Terms & Privacy
            </NavLink>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-lg font-semibold text-gray-800 mb-4'>CONTACT</p>
          <ul className='flex flex-col gap-2'>
            <a href='tel:+919876543210' className='hover:text-primary-custom transition'>+91-9876543210</a>
            <a href='mailto:support@prescripto.com' className='hover:text-primary-custom transition'>support@prescripto.com</a>
            <p className='hover:text-primary-custom transition'>Delhi, India</p>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <p className='text-lg font-semibold text-gray-800 mb-4'>STAY UPDATED</p>
          <p className='mb-3 text-gray-500 text-sm'>
            Subscribe to our newsletter to get the latest health tips & updates.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed successfully 🚀");
            }}
            className='flex items-center bg-gray-100 rounded-full overflow-hidden'
          >
            <input
              type='email'
              placeholder='Your email'
              required
              className='flex-grow px-4 py-2 bg-transparent focus:outline-none text-sm'
            />
            <button type='submit' className='bg-primary-custom text-white px-5 py-2 text-sm font-medium hover:opacity-90 transition'>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className='mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500'>
        © 2025 Kamalspace — All Rights Reserved.
      </div>
    </div>
  )
}

export default Footer
