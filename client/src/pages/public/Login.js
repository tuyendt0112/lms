import React, { useState, useCallback, useEffect } from 'react'
import loginpng from 'assets/login.jpg'
import { InputFields, Button, Loading } from 'components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from 'apis/user'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from 'ultils/path'
import { login } from 'store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from 'ultils/helper'
import { Link } from 'react-router-dom'
import { showModal } from 'store/app/appSilice'
const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [payload, setpayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  })
  const [invalidFields, setinvalidFields] = useState([])
  const [isForgotPassword, setisForgotPassword] = useState(false)
  const [isRegister, setisRegister] = useState(false)
  const resetPayload = () => {
    setpayload({
      email: '',
      password: '',
      firstname: '',
      lastname: ''
    })
  }
  const [isVerifiedEmail, setisVerifiedEmail] = useState(false)
  const [token, settoken] = useState('')
  console.log("CHECK >>>", token)
  const [email, setemail] = useState('')
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email })
    console.log(response)
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' })
    } else {
      toast.info(response.mes, { theme: 'colored' })
    }
  }
  useEffect(() => {
    resetPayload()
  }, [isRegister])
  //SUBMIT 
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, ...data } = payload
    const invalids = isRegister ? validate(payload, setinvalidFields) : validate(data, setinvalidFields)
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiRegister(payload)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
          setisVerifiedEmail(true)
        } else {
          Swal.fire('Oops!', response.mes, 'error')
        }
      } else {
        const rs = await apiLogin(data)
        if (rs.success) {
          dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
          navigate(`/${path.HOME}`)
        } else {
          Swal.fire('Oops!', rs.mes, 'error')
        }
      }
    }
  }, [payload, isRegister])
  const finalRegister = async () => {
    const response = await apiFinalRegister(token)
    console.log(response)
    if (response.success) {
      Swal.fire('Congratulation', response.mes, 'success').then(() => {
        setisRegister(false)
        resetPayload()
      })
    } else {
      Swal.fire('Oops!', response.mes, 'error')
    }
    setisVerifiedEmail(false)
    settoken('')
  }
  return (
    <div className='w-screen h-screen relative'>
      {isVerifiedEmail && <div className='absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center'>
        <div className='bg-white w-[500px] rounded-md p-8'>
          <h4 className=''>Please check your mail and enter your code:</h4>
          <input type='text'
            value={token}
            onChange={e => settoken(e.target.value)}
            className='p-2 border rounded-md outline-none'
          ></input>
          <Button
            style='px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4'
            handleOnClick={finalRegister}
          >
            Submit
          </Button>
        </div>
      </div>}
      {isForgotPassword && <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email' className=''>Enter your email:</label>
          <input type='text' id='email'
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm' placeholder='email@gmail.com'
            value={email}
            onChange={e => setemail(e.target.value)}
          ></input>
          <div className='flex items-center justify-end w-full gap-4'>
            <Button
              name='Submit'
              handleOnClick={handleForgotPassword}
              style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
            ></Button>
            <Button
              name='Cancel'
              handleOnClick={() => setisForgotPassword(false)}
            >
            </Button>
          </div>
        </div>
      </div>}
      <img src={loginpng} alt='' className='w-full h-full object-cover'></img>
      <div className='absolute top-0 bottom-0 left-1/2 right-0 items-center justify-center flex'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-6'>{isRegister ? 'Register' : 'Login'}</h1>
          {
            isRegister && <div className='flex items-center gap-2'>
              <InputFields
                value={payload.firstname}
                setValue={setpayload}
                nameKey='firstname'
                invalidFields={invalidFields}
                setInvalidFields={setinvalidFields}
                fullWidth
              />
              <InputFields
                value={payload.lastname}
                setValue={setpayload}
                nameKey='lastname'
                invalidFields={invalidFields}
                setInvalidFields={setinvalidFields}
                fullWidth
              />
            </div>
          }
          <InputFields
            value={payload.email}
            setValue={setpayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setinvalidFields}
            fullWidth
          />
          <InputFields
            value={payload.password}
            setValue={setpayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setinvalidFields}
            fullWidth
          />
          <Button
            handleOnClick={handleSubmit}
            fw
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
          <div className='flex items-center justify-between my-2 w-full'>
            {!isRegister && <span onClick={() => setisForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Forgot password</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setisRegister(true)}>Sign Up</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setisRegister(false)}>Back to Login</span>}
          </div>
          <Link className='text-blue-500 hover:underline cursor-pointer' to={`/${path.HOME}`}>Homepage</Link>
        </div>
      </div>
    </div>
  )
}
export default Login