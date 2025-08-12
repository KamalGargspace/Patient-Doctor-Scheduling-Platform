import { useState, useRef } from 'react'
import React from 'react'
import { assets } from '../assets/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const {token,setToken,userData} = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const logout = ()=>{
    setToken(false);
    localStorage.removeItem('token');
    navigate('/login');
  }

  const navLinkStyles = 'py-1 hover:text-primary-custom transition duration-300 ease-in-out';

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  return (
    <div className='w-full bg-white border-b border-gray-100'>
      <div className='flex items-center justify-between text-sm py-4 mb-0 px-6 md:px-10 lg:px-16 xl:px-20'>

        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          className='w-40 cursor-pointer hover:scale-105 transition-transform duration-300'
          src={assets.logo}
          alt="Prescripto Logo"
        />

        {/* Desktop Menu */}
        <ul className='hidden md:flex items-center gap-7 font-medium text-gray-700'>
          <NavLink to='/' className={({ isActive }) => isActive ? 'text-primary-custom' : ''}>
            <li className={navLinkStyles}>HOME</li>
          </NavLink>
          <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-primary-custom' : ''}>
            <li className={navLinkStyles}>ALL DOCTORS</li>
          </NavLink>
          <NavLink to='/about' className={({ isActive }) => isActive ? 'text-primary-custom' : ''}>
            <li className={navLinkStyles}>ABOUT</li>
          </NavLink>
          <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-primary-custom' : ''}>
            <li className={navLinkStyles}>CONTACT</li>
          </NavLink>
        </ul>

        {/* Right-side Actions */}
        <div className='flex items-center gap-4'>

          {token && userData ? (
            <div
              className='relative cursor-pointer'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Profile + Dropdown Icon */}
              <div className='flex items-center gap-2'>
                <img className='w-9 h-9 rounded-full border-2 border-primary-custom' src={userData.image} alt="profile" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown" />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className='absolute top-12 right-0 min-w-48 bg-white rounded-md shadow-lg p-4 flex flex-col gap-3 text-left border border-gray-200 text-base font-medium text-gray-600 z-30'>
                  <p onClick={() => { navigate('my-profile'); setShowDropdown(false); }} className='hover:text-primary-custom transition cursor-pointer'>My Profile</p>
                  <p onClick={() => { navigate('my-appointments'); setShowDropdown(false); }} className='hover:text-primary-custom transition cursor-pointer'>My Appointments</p>
                  <p onClick={() => { logout(); setShowDropdown(false); }} className='hover:text-primary-custom transition cursor-pointer'>Logout</p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='bg-primary-custom text-white px-6 py-2 rounded-full font-light hidden md:block hover:opacity-90 transition'
            >
              Create Account
            </button>
          )}

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setShowMenu(true)}
            className='w-6 md:hidden cursor-pointer'
            src={assets.menu_icon}
            alt="Menu"
          />

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
            <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
              <img className='w-32' src={assets.logo} alt="Logo" />
              <img className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
            </div>
            <ul className='flex flex-col items-center gap-5 mt-8 text-lg font-medium text-gray-700'>
              <NavLink onClick={() => setShowMenu(false)} to='/'>
                <p className='px-4 py-2 rounded hover:bg-gray-100 transition w-full text-center'>Home</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors'>
                <p className='px-4 py-2 rounded hover:bg-gray-100 transition w-full text-center'>ALL DOCTORS</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about'>
                <p className='px-4 py-2 rounded hover:bg-gray-100 transition w-full text-center'>ABOUT</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact'>
                <p className='px-4 py-2 rounded hover:bg-gray-100 transition w-full text-center'>CONTACT</p>
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
