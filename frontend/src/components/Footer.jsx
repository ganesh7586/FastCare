import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='mt-40 flex flex-col  min-h-200'>
      <div className='flex flex-col md:flex-row gap-8 min-h-60'>
        <div className=' md:w-1/2 flex flex-col gap-7'>
          <img className='w-44 h-20' src={assets.logo1} alt="" />
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia pariatur doloribus itaque consectetur, odio ullam. Minima maiores architecto veniam obcaecati maxime, quam adipisci aut laborum, nostrum quaerat voluptatem perferendis. Sunt.</p>
        </div>
        <div className='md:w-1/3 flex flex-col gap-6'>
          <h1 className='text-2xl'>COMPANY</h1>
          <ul className='flex flex-col gap-3'>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className='w-1/3 flex flex-col gap-3'>
          <h1 className='text-2xl'>GET IN TOUCH</h1>
          <p>+1-121-456-9381</p>
          <p>medslot@gmail.com</p>
        </div>
      </div>
       <div className='h-10 w-full mt-10' >
       <hr />
      <p className='text-center'>Copy Right @ 2025 --- action taken &*(3094758)</p>
       </div>
    </div>
  )
}

export default Footer
