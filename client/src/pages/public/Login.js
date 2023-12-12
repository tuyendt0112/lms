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
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'
import { IoMdLock } from "react-icons/io";
import { MdLock } from "react-icons/md";
import { FaStepBackward } from "react-icons/fa";
import { FaPen } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [payload, setpayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: '',
  })
  const [invalidFields, setinvalidFields] = useState([])
  const [isForgotPassword, setisForgotPassword] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isRegister, setisRegister] = useState(false)
  const [isRegisterPitchOwner, setisRegisterPitchOwner] = useState(false)
  const resetPayload = () => {
    setpayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      role: ''
    })
  }
  const [isVerifiedEmail, setisVerifiedEmail] = useState(false)
  const [token, settoken] = useState('')
  const [email, setemail] = useState('')
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email })
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' })
    } else {
      toast.info(response.mes, { theme: 'colored' })
    }
  }
  useEffect(() => {
    resetPayload()
  }, [isRegister, isRegisterPitchOwner])
  //SUBMIT 
  const handleSubmit = useCallback(async () => {
    if (isRegisterPitchOwner) payload.role = '2'
    else payload.role = '3'
    const { firstname, lastname, role, ...data } = payload
    const invalids = isRegister ? validate(payload, setinvalidFields) : isRegisterPitchOwner ? validate(payload, setinvalidFields) : validate(data, setinvalidFields)
    console.log(invalids)
    if (invalids === 0) {
      if (isRegister || isRegisterPitchOwner) {
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
    if (response.success) {
      Swal.fire('Congratulation', response.mes, 'success').then(() => {
        setisRegister(false)
        setisRegisterPitchOwner(false)
        resetPayload()
      })
    } else {
      Swal.fire('Oops!', response.mes, 'error')
    }
    setisVerifiedEmail(false)
    settoken('')
  }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full relative'>
      {isVerifiedEmail &&
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center'>
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
        </div>
      }

      {isForgotPassword &&
        <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-login to-login-2 flex flex-col items-center py-8 z-50'>
          <div className='flex flex-col gap-4'>
            <label htmlFor='email' className='text-white'>Enter your email:</label>
            <input type='text' id='email'
              className='w-[800px] pb-2 border-b outline-none placeholder:text-sm rounded-md' placeholder='email@gmail.com'
              value={email}
              onChange={e => setemail(e.target.value)}
            ></input>
            <div className='flex items-center justify-end w-full gap-4'>
              <Button
                handleOnClick={handleForgotPassword}
                style='text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
              >
                Submit
              </Button>
              <Button
                handleOnClick={() => setisForgotPassword(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      }
      <div className='hidden sm:block'>
        <img src={loginpng} alt='' className='w-fit h-screen object-cover'></img>
      </div>
      <div className='absolute top-0 bottom-0 left-1/2 right-0 items-center justify-center flex bg-gradient-to-r from-login to-login-2'>
        <div className='max-w-[400px] w-full mx-auto bg-transeparent p-8 px-8 rounded-lg'>
          <h2 className='text-4xl font-bold text-center text-white'>{isRegister ? 'SIGN UP' : isRegisterPitchOwner ? 'PITCH OWNER ' : 'SIGN IN'}</h2>
          <div className=' flex py-1'>
            {
              !isRegister && !isRegisterPitchOwner &&
              <div>
                <div className='flex'>
                  <p className='mr-2 text-white'>
                    Don't have an account?
                  </p>
                  <span className='text-blue-500 hover:text-white hover:underline cursor-pointer ' onClick={() => setisRegister(true)}>Sign Up</span>
                </div>
                <div className='flex'>
                  <p className='mr-2 text-white'>
                    Or create your own brand?
                  </p>
                  <span className='text-blue-500 hover:text-white hover:underline cursor-pointer ' onClick={() => setisRegisterPitchOwner(true)}>Let' Go</span>
                </div>
              </div>
            }
          </div>
          {isRegister && !isRegisterPitchOwner &&
            <div className='flex items-center gap-4 pb-1'>
              <div style={{ position: 'relative' }}>
                <InputFields
                  value={payload.firstname}
                  setValue={setpayload}
                  nameKey='firstname'
                  invalidFields={invalidFields}
                  setInvalidFields={setinvalidFields}
                  fullWidth
                />
                <FaPen style={{ position: 'absolute', top: 18, left: 12, }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <InputFields
                  value={payload.lastname}
                  setValue={setpayload}
                  nameKey='lastname'
                  invalidFields={invalidFields}
                  setInvalidFields={setinvalidFields}
                  fullWidth
                />
                <FaPen style={{ position: 'absolute', top: 18, left: 12, }}
                />
              </div>
            </div>
          }
          {isRegisterPitchOwner && !isRegister &&
            <div className='flex items-center gap-4 pb-1'>
              <div style={{ position: 'relative' }}>
                <InputFields
                  value={payload.firstname}
                  setValue={setpayload}
                  nameKey='firstname'
                  invalidFields={invalidFields}
                  setInvalidFields={setinvalidFields}
                  fullWidth
                />
                <FaPen style={{ position: 'absolute', top: 18, left: 12, }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <InputFields
                  value={payload.lastname}
                  setValue={setpayload}
                  nameKey='lastname'
                  invalidFields={invalidFields}
                  setInvalidFields={setinvalidFields}
                  fullWidth
                />
                <FaPen style={{ position: 'absolute', top: 18, left: 12, }}
                />
              </div>
            </div>
          }
          <div className='flex flex-col py-1'>
            <div style={{ position: 'relative' }}>
              <InputFields
                value={payload.email}
                setValue={setpayload}
                nameKey='email'
                invalidFields={invalidFields}
                setInvalidFields={setinvalidFields}
                fullWidth
              />
              <FaUser style={{ position: 'absolute', top: 18, left: 12, }}
              />
            </div>
          </div>
          <div className='flex flex-col py-1'>
            <div style={{ position: 'relative' }}>
              <InputFields
                value={payload.password}
                setValue={setpayload}
                nameKey='password'
                type={isShowPassword ? 'text' : 'password'}
                invalidFields={invalidFields}
                setInvalidFields={setinvalidFields}
                fullWidth
              />
              <MdLock className='text-xl' style={{ position: 'absolute', top: 16, left: 12, }}
              />
              <div
                className='text-xl'
                style={{ position: 'absolute', top: 16, right: 12, cursor: 'pointer' }}
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {
                  isShowPassword ? <FaEye /> : <FaEyeSlash />
                }
              </div>
            </div>
          </div>
          <div className='flex justify-between text-black py-1 '>
            {!isRegister && !isRegisterPitchOwner &&
              <>
                <Link className='text-white hover:underline cursor-pointer' to={`/${path.HOME}`}>Homepage</Link>
                <span onClick={() => setisForgotPassword(true)} className='text-white hover:underline cursor-pointer'>Forgot password</span>
              </>
            }
          </div>
          <Button
            handleOnClick={handleSubmit}
            fw
            style='w-full my-2 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-violet-700/70 hover:shadow-violet-500/80 rounded-md'
          >
            {isRegister ? 'Register' : isRegisterPitchOwner ? 'Register' : 'Login'}
          </Button>
          <div className='flex items-center justify-between my-2 w-full'>

            {isRegister && !isRegisterPitchOwner &&
              <>
                <span className='text-white hover:underline cursor-pointer w-full flex items-center justify-center' onClick={() => setisRegister(false)}> <FaStepBackward /> Back to Login</span>
              </>
            }

            {isRegisterPitchOwner && !isRegister &&
              <>
                <span className='text-white hover:underline cursor-pointer w-full flex items-center justify-center' onClick={() => setisRegisterPitchOwner(false)}> <FaStepBackward /> Back to Login</span>
              </>
            }
          </div>
        </div>
      </div>
    </div >
  )
}
export default Login