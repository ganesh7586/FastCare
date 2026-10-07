import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctor from './pages/Doctor.jsx'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppoinment from './pages/MyAppoinment'
import Appointment from './pages/Appointment.jsx'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'; 
import Chat from './pages/chat.jsx'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%] no-scrollbar'>
      <ToastContainer/>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppoinment />} />
        <Route path='/my-appoinment' element={<MyAppoinment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
