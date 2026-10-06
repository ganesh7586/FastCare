import { assets } from '../assets/assets_frontend/assets'

const Banner = () => {
  return (
    <div className='relative w-full h-100 rounded-2xl shadow-2xl mt-40 flex bg-primary flex-row'>
      <div className='flex w-full px-10 md:w-1/2 flex-col md:px-20 justify-center gap-8'>
        <h1 className='block text-2xl md:text-3xl font-bold text-white'>Book Appointment</h1>
        <h1 className='block text-2xl md:text-3xl font-bold text-white'>With 100+ Trusted Doctors</h1>
        <button className='px-3 w-38 text-primary hover:scale-95 transition-all duration-300 py-2 rounded-full bg-white'>Create account</button>
      </div> 
      <img className='absolute hidden md:block left-160 bottom-0 h-120' src={assets.appointment_img} alt="" />
    </div>
  )
}

export default Banner
