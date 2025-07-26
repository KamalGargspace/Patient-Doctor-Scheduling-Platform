import React from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
}

export default App
