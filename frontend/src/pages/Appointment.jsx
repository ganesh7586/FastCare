import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = useCallback(async () => {
    const doc = doctors.find(doc => doc._id === docId)
    setDocInfo(doc)
  }, [doctors, docId])

  const getAvailableSlots = useCallback(async () => {
    setDocSlots([])
    let today = new Date()
    let allSlots = []

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        const isSlotAvailable = docInfo.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      allSlots.push(timeSlots)
    }

    setDocSlots(allSlots)
  }, [docInfo])

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment')
      return navigate('/login')
    }

    if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      return toast.warn('No slots available for this day')
    }

    if (!slotTime) {
      return toast.warn('Please select a time slot')
    }

    try {
      const date = docSlots[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleStartChat = async () => {
    if (!token) {
      toast.warn('Please login to message the doctor')
      return navigate('/login')
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/chat/user/start/${docId}`, {
        headers: { token }
      })
      if (data.success) {
        navigate('/chat', { state: { selectedConv: data.conversation } })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [fetchDocInfo])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo, getAvailableSlots])

  return docInfo ? (
    <div>
      {/* ---------- Doctor Details ---------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <div className='flex items-center justify-between flex-wrap gap-2'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name}
              <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <button
              onClick={handleStartChat}
              title='Message Doctor'
              className='flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer shadow-sm'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Message Doctor</span>
            </button>
          </div>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${docInfo.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {docInfo.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-900 font-semibold'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ---------- Booking Slots ---------- */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700'>
        <p className='text-lg'>Booking slots</p>
        
        {!docInfo.available ? (
          <p className='text-red-500 mt-4 font-normal'>This doctor is currently not accepting new appointments.</p>
        ) : (
          <>
            <div className='flex gap-3 items-center w-full overflow-x-auto mt-4'>
              {docSlots.length > 0 && docSlots.map((item, index) => {
                let dayDate = new Date()
                dayDate.setDate(dayDate.getDate() + index)
                return (
                  <div
                    key={index}
                    onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                  >
                    <p>{daysOfWeek[dayDate.getDay()]}</p>
                    <p>{dayDate.getDate()}</p>
                  </div>
                )
              })}
            </div>

            <div className='flex items-center gap-3 w-full scrollbar-none overflow-x-auto mt-4'>
              {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
                docSlots[slotIndex].map((item, index) => (
                  <p
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300 hover:border-primary'}`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))
              ) : (
                <p className='text-sm text-gray-400 py-2'>No time slots available for this day</p>
              )}
            </div>

            <button
              onClick={bookAppointment}
              className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer hover:scale-105 transition-all duration-300'
            >
              Book an appointment
            </button>
          </>
        )}
      </div>

     <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  ) : null
}

export default Appointment

