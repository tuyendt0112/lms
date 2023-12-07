import React, { memo, useState, useEffect } from 'react'
import logo from 'assets/logo.png'
import icons from 'ultils/icons'
import { Link } from 'react-router-dom'
import path from 'ultils/path'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from 'store/user/userSlice'

const { RiPhoneFill, MdEmail, FaUserCircle } = icons
const Header = () => {
    const { current } = useSelector(state => state.user)
    console.log(current)
    const [isShowOption, setisShowOption] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById('profile')
            if (!profile?.contains(e.target)) setisShowOption(false)
        }
        document.addEventListener('click', handleClickoutOptions)
        return () => {
            document.removeEventListener('click', handleClickoutOptions)
        }
    }, [])
    // console.log("CURRENT", current)
    return (
        <div className='w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>
            <div className='flex text-[13px]'>
                <div className='flex flex-col px-6 border-r items-center'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red'></RiPhoneFill>
                        <span className='font-semibold'>(+84) 09090909</span>
                    </span>
                    <span>Mon-Fri 9:00AM - 5:00PM</span>
                </div>
                <div className='flex flex-col px-6 border-r items-center'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red'></MdEmail>
                        <span className='font-semibold'>DEBUGBOY@GMAIL.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {current &&
                    <div
                        className='flex cursor-pointer items-center justify-center px-6 gap-2 relative'
                        onClick={() => setisShowOption(prev => !prev)}
                        id='profile'
                    >
                        {isShowOption && <div onClick={e => e.stopPropagation()} className='absolute top-full flex-col flex  bg-gray-100 border min-w-[150px] py-2'>
                            <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.MEMBER}/${path.PERSONAL}`}
                            >Personal
                            </Link>
                            {
                                +current.role === 1 && <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                >Admin Workspace
                                </Link>
                            }
                            {
                                +current.role === 2 && <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.PITCHOWNER}/${path.MANAGE_PITCHOWN}`}
                                >Pitch Owner Workspace
                                </Link>
                            }
                        </div>}
                        <FaUserCircle size={24}></FaUserCircle>
                    </div>
                }
            </div>
        </div>
    )
}

export default memo(Header)