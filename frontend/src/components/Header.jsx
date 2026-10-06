import { assets } from '../assets/assets_frontend/assets'

const Header = () => {
  return (
    <div className="bg-primary h-140 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-5 sm:px-8 md:px-10 lg:px-16 xl:px-2">
      {/* Left Side */}
      <div className="w-full md:w-1/2 px-4 py-10 sm:py-12 md:py-16 flex flex-col gap-6 text-white">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          Your Health, Our Priority 🩺
          <br />
          Connect With Trusted Healthcare Professionals
        </p>

        {/* Profiles + Description */}
        <div className="flex items-center gap-3 max-w-lg">
          <img
            className="h-9 sm:h-10 w-auto"
            src={assets.group_profiles}
            alt="Trusted healthcare professionals"
          />
          <p className="text-xs sm:text-sm leading-relaxed">
            Simply browse through our experienced list of trusted doctors
            and schedule your appointment hassle-free.
          </p>
        </div>

        {/* Book Appointment Button */}
        <a
          className="flex w-fit rounded-full gap-2 items-center px-5 py-2.5 text-primary bg-white transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:shadow-2xl shadow-white/45 hover:scale-105"
          href="#speciality"
        >
          Book Appointment
          <img
            className="w-4 mt-1"
            src={assets.arrow_icon}
            alt=""
          />
        </a>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end self-end">
        <img
          className="w-[80%] sm:w-[65%] md:w-full max-w-md lg:max-w-lg object-contain"
          src={assets.header_img}
          alt="Healthcare professional"
        />
      </div>
    </div>
  )
}

export default Header
