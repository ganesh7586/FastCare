import { useContext, useEffect, useState, useCallback } from "react"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets_frontend/assets"
import axios from "axios"
import { toast } from "react-toastify"

const MyAppoinment = () => {
  const { backendUrl, token, setToken, getDoctorsData, slotDateFormat, currencySymbol } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
        if (data.message === 'invalid signature' || data.message === 'jwt expired' || data.message.toLowerCase().includes('authorized')) {
          setToken('');
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }, [backendUrl, token, setToken])

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const appointmentPayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token, getUserAppointments])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.length === 0 ? (
          <p className='py-8 text-center text-gray-500'>No appointments booked yet.</p>
        ) : (
          appointments.map((item, index) => (
            <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
              <div>
                <img className='w-32 bg-indigo-50 rounded-lg object-cover' src={item.docData?.image || assets.doc1} alt={item.docData?.name} />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold text-base'>{item.docData?.name}</p>
                <p className='text-zinc-600'>{item.docData?.speciality}</p>
                <p className='text-zinc-700 font-medium mt-2'>Address:</p>
                <p className='text-xs'>{typeof item.docData?.address === 'object' ? item.docData?.address?.line1 : item.docData?.address}</p>
                {typeof item.docData?.address === 'object' && item.docData?.address?.line2 && (
                  <p className='text-xs'>{item.docData?.address?.line2}</p>
                )}
                <p className='text-xs mt-2'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Fee:</span> {currencySymbol}{item.amount}
                </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && !item.isCompleted && !item.payment && (
                  <button
                    onClick={() => appointmentPayment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && item.payment && (
                  <button className='sm:min-w-48 py-2 border rounded text-green-600 bg-green-50 font-medium text-sm'>
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 text-sm font-medium'>
                    Appointment cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 text-sm font-medium'>
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyAppoinment

