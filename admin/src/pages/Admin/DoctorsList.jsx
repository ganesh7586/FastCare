import { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {

    const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aToken]);

    return (
        <div className='m-5 min-h-[60vh] max-h-[120vh] overflow-y-scroll no-scrollbar'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {
                    doctors?.map((item, index) => (
                        <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer shadow-2xl group bg-white' key={index}>
                            <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 w-full h-48 object-cover' src={item.image} alt="" />
                            <div className='p-4'>
                                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                                <div className='mt-2 flex items-center gap-1 text-sm'>
                                    <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} className='cursor-pointer' />
                                    <p className='cursor-pointer' onClick={() => changeAvailability(item._id)}>Available</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default DoctorsList;
