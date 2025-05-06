
import './App.css'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router'

function App() {

  return (
    <>

      <div className="flex flex-col items-center  min-h-screen relative">
        <ToastContainer />
        <Outlet />
      </div>
    </>
  )
}

export default App
