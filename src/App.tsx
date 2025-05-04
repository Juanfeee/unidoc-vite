import { useState } from 'react'

import './App.css'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router'

function App() {

  return (
    <>
      <ToastContainer />

      <div className="flex flex-col items-center justify-center min-h-screen relative w-screen">
        <Outlet />
      </div>
    </>
  )
}

export default App
