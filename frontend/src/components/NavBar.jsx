import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const NavBar = () => {
  const navigate = useNavigate()
  const {userData} = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)
  const {token,setToken} = useContext(AppContext)
  const logout = ()=>{
     setToken(false)
     localStorage.removeItem('token')
  }
  return (
    <div className='flex h-25 flex-row items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer h-20' src={assets.logo1} alt="Logo" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink> 
      </ul>
      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex justify-end items-center w-38 mr-6 gap-2 cursor-pointer group relative'>
            <img className='w-8 h-8 rounded-full object-cover' src={userData?.image || assets.profile_pic} alt="" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-10 pt-17 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black hover:font-bold cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black hover:font-bold cursor-pointer'>My Appointments</p>
                <p onClick={() => logout()} className='hover:text-black hover:font-bold cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='w-38 bg-primary px-4 py-2 text-white rounded-full font-light md:block cursor-pointer hover:opacity-90 transition-all'>Create Account</button>
        )}
        <img onClick={() => setShowMenu(true)} className='w-8 h-8 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />
        
        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 right-0 bottom-0 z-30 bg-white transition-all duration-300 md:hidden ${showMenu ? 'w-full p-6' : 'w-0 p-0 overflow-hidden pointer-events-none'}`}>
          <div className='flex items-center justify-between'>
            <img className='w-36 h-14 object-contain' src={assets.logo1} alt="Logo" />
            <img onClick={() => setShowMenu(false)} className='w-7 cursor-pointer' src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col gap-4 mt-8 px-2 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
            {token ? (
              <>
                <hr className='my-2 border-gray-200' />
                <NavLink onClick={() => setShowMenu(false)} to='/my-profile'><p className='px-4 py-2 rounded inline-block text-primary'>My Profile</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to='/my-appointments'><p className='px-4 py-2 rounded inline-block text-primary'>My Appointments</p></NavLink>
                <p onClick={() => { logout(); setShowMenu(false); }} className='px-4 py-2 rounded inline-block text-red-500 cursor-pointer'>Logout</p>
              </>
            ) : (
              <NavLink onClick={() => setShowMenu(false)} to='/login'><p className='px-4 py-2 rounded inline-block text-primary'>Sign In / Create Account</p></NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NavBar
