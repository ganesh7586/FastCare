import { useContext } from 'react'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const {token,setToken,backendUrl} = useContext(AppContext)

  const navigate = useNavigate();
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if(state === 'Sign Up'){
        const {data} =await axios.post(backendUrl+'/api/user/register',{name,email,password});
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
        }
      }
      else{
         const {data} =await axios.post(backendUrl+'/api/user/login',{email,password});
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  useEffect(()=>{
    if(token){
      navigate('/');
    }
  },[token, navigate])

  return (
    <div className='min-h-[75vh] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white border border-gray-200/80 rounded-2xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>{state === 'Sign Up' ? 'Create an Account' : 'Welcome Back'}</h2>
            <p className='text-xs text-gray-500 mt-0.5'>{state === 'Sign Up' ? 'Get started with FastCare in seconds' : 'Access your FastCare appointments'}</p>
          </div>
          <div className='w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold text-lg select-none'>✚</div>
        </div>
        <div className='grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-6 text-xs font-medium'>
          <button type='button' onClick={() => setState('Sign Up')} className={`py-2 rounded-lg transition-all cursor-pointer ${state === 'Sign Up' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>Sign Up</button>
          <button type='button' onClick={() => setState('Login')} className={`py-2 rounded-lg transition-all cursor-pointer ${state === 'Login' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>Sign In</button>
        </div>
        <form onSubmit={onSubmitHandler} className='space-y-4 text-sm text-gray-700'>
          {state === 'Sign Up' && (
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Full Name</label>
              <input type='text' required value={name} onChange={(e) => setName(e.target.value)} placeholder='FastCareUser' className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800' />
            </div>
          )}

          <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>Email Address</label>
            <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='fastcare@user.com' className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800' />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>Password</label>
            <input type='password' required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='••••••••' className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800' />
          </div>

          <button type='submit' className='w-full mt-2 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm'>
            <span>{state === 'Sign Up' ? 'Create Account' : 'Sign In'}</span>
            <span className='text-xs'>→</span>
          </button>
        </form>

        <p className='text-center text-xs text-gray-500 mt-6'>
          {state === 'Sign Up' ? (
            <>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-medium hover:underline cursor-pointer'>Sign in</span></>
          ) : (
            <>New to FastCare? <span onClick={() => setState('Sign Up')} className='text-primary font-medium hover:underline cursor-pointer'>Create an account</span></>
          )}
        </p>

        <div className='mt-6 pt-5 border-t border-gray-100 text-center'>
          <a
            href='https://fast-care-w9i5.vercel.app/'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-gray-50'
          >
            <span>🛡️ Doctor / Admin Login</span>
            <span className='text-[10px]'>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
