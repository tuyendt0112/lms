import React, { useState, useCallback } from 'react'
import login from '../../assets/login.jpg'
import { InputFields, Button } from '../../components'

const Login = () => {
  const [payload, setpayload] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [isRegister, setisRegister] = useState(false)
  const handleSubmit = useCallback(() => {
    console.log(payload)
  }, [payload])
  return (
    <div className='w-screen h-screen relative'>
      <img src={login} alt='' className='w-full h-full object-cover'></img>
      <div className='absolute top-0 bottom-0 left-1/2 right-0 items-center justify-center flex'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-6'>{isRegister ? 'Register' : 'Login'}</h1>
          {isRegister && <InputFields
            value={payload.name}
            setValue={setpayload}
            nameKey='name'
          ></InputFields>}

          <InputFields
            value={payload.email}
            setValue={setpayload}
            nameKey='email'
          ></InputFields>

          <InputFields
            value={payload.password}
            setValue={setpayload}
            nameKey='password'
            type='password'
          ></InputFields>

          <Button
            name={isRegister ? 'Register' : 'Login'}
            handleOnClick={handleSubmit}
            fw
          ></Button>
          <div className='flex items-center justify-between my-2 w-full'>
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'>Forgot password</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setisRegister(true)}>Sign Up</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setisRegister(false)}>Back to Login</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login