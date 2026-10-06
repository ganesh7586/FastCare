import { useContext, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const filterDoc = useMemo(() => {
    if (speciality) {
      return doctors.filter(doc => doc.speciality === speciality)
    }
    return doctors
  }, [doctors, speciality])

  return (
    <div className='flex flex-row'>
       <div className='w-1/3 md:1/2 sm:w-1/3 flex flex-col gap-15 border-r-1 border-primary'>
         <p className='font-bold text-primary'>Browse through the doctors specialist:</p>
          <div className='flex flex-col gap-3'>
         <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`cursor-pointer ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>General Physician</p>
         <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`cursor-pointer ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>Gynecologist</p>
         <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`cursor-pointer ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>Dermatologist</p>
         <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`cursor-pointer ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>Pediatrician</p>
         <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`cursor-pointer ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>Neurologist</p>
         <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''} border m-2 hover:text-lg md:text-xl text-xs overflow-auto no-scrollbar rounded hover:scale-105 hover:bg-blue-300 hover:border-amber-400 transition-all duration-500 py-2 px-2`}>Gastroenterologist</p>
          </div>
       </div>
       <div className='flex-1 ml-5'>
        {filterDoc.length === 0 ? (
          <div className='flex flex-col items-center justify-center min-h-60 text-gray-500'>
            <p className='text-lg font-medium'>No doctors available for this specialty.</p>
            <button onClick={() => navigate('/doctors')} className='mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm cursor-pointer hover:opacity-90'>
              View All Doctors
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7'>
            {filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                key={index}
                className='border shrink-0 border-blue-200 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white'
              >
                <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt={item.name} />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-400'}`}>
                    <p className={`h-2 w-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                    <p>{item.available ? 'Available' : 'Unavailable'}</p>
                  </div>
                  <p className='text-gray-900 font-medium text-base mt-1'>{item.name}</p>
                  <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        )}
       </div>
    </div>
  )
}

export default Doctor
