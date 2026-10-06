import { assets } from "../assets/assets_frontend/assets"

const About = () => {
  return (
    <div>
       <div className="text-center text-2xl pt-10 text-gray-500">
        <p>ABOUT <span className="text-gray-700 font-medium ">US</span> </p>
       </div>
      <div className="my-10 flex flex-col md:flex-row gap-12 ">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <b className="text-gray-800">We’re Making Healthcare Easier 🩺</b>
          <p>At FastCare, we believe booking a doctor should be simple and stress-free. Our platform helps you discover doctors across different specialties, view their profiles, and book appointments conveniently from one place. Discover qualified healthcare professionals, check their availability, and schedule your appointment in just a few clicks.</p>
          <b className="text-gray-800">Our Vision</b>
          <p>To make quality healthcare more accessible and convenient for everyone. We envision a future where finding the right doctor and booking an appointment is simple, transparent, and just a few clicks away.</p>
        </div>
      </div>
      
      <div className="text-xl my-4">
        <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer">
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
