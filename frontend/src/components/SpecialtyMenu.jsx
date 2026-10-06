import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const SpecialtyMenu = () => {
  return (
    <div id='speciality' className='mt-10 flex flex-col items-center min-h-80 justify-between'>
       <div>
         <h1 className='text-3xl text-center'>Find By Speciality</h1>
        <p className='text-sm text-center mt-3'>Simply browse through our extensive list of trusted doctors ,
          <br /> schedule your appointment </p>
       </div>
        <div className='flex p-5 flex-row gap-9 flex-wrap justify-center'>
            {specialityData.map((item,index)=>(
                <Link onClick={()=>window.scrollTo(0,0)} key={index} to={`/doctors/${item.speciality}`}>
                   <div className='h-30 flex flex-col items-center justify-center w-30'>
                    <img className='w-16 sm:w-24 hover:translate-y-[-10px] duration-500 transition-all' src={item.image} alt="" />
                   <p className='text-center text-sm sm:text-xs'>{item.speciality}</p>
                   </div>
                </Link>
            ))}
        </div>
      
    </div>
  )
}

export default SpecialtyMenu
