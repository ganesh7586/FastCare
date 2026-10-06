import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({speciality,docId}) => {
    const navigate = useNavigate()
    const {doctors} = useContext(AppContext)
    const [relDoc,setRelDoc] = useState([]);
    useEffect(()=>{
      if(doctors.length > 0 && speciality){
        const doctorsData = doctors.filter((doc)=> doc.speciality === speciality && doc._id !== docId);
        setRelDoc(doctorsData);
      }
    },[doctors,docId,speciality])
  return (
    <div className='flex w-full flex-col items-center gap-4 my-16 text-black md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1> 
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our list of trusted doctors</p>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6'>
        {relDoc.slice(0, 10).map((item, index) => (
          <div onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }} key={index} className='border shrink-0 border-blue-200 shadow-xl rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white'>
            <img className='bg-blue-50 w-full h-44 object-cover' src={item.image} alt="" />
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
      <button onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }} className='bg-primary px-5 mt-5 w-30 hover:scale-90 hover:shadow-2xl transition-all duration-500 text-white h-12 py-2 rounded-full cursor-pointer'>more</button>
    </div>
  )
}

export default RelatedDoctors
