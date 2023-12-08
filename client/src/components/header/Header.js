import React, { memo, useState, useEffect } from 'react'
import logo from 'assets/logo.png'
import icons from 'ultils/icons'
import { Link } from 'react-router-dom'
import path from 'ultils/path'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from 'store/user/userSlice'
import avatar from 'assets/defaultava.png'
import { showOrder } from 'store/app/appSilice'

const { RiPhoneFill, MdEmail, FaUserCircle, BsCart } = icons
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
                {current &&
                    <div
                        className='flex cursor-pointer items-center justify-center px-6 gap-2 relative'
                        onClick={() => setisShowOption(prev => !prev)}
                        id='profile'
                    >
                        <>
                            <label htmlFor='file'>
                                <img src={current?.avatar || avatar} alt='avatar' className='w-7 h-7 ml-8 object-cover rounded-full'></img>
                            </label>
                            <span>Profile</span>

                            <div
                                className="flex items-center gap-1 cursor-pointer "
                                onClick={() => dispatch(showOrder())}
                            >
                                <BsCart size={24} className="text-blue-900" />
                                <span className="hover:text-blue-500">Booking</span>
                            </div>
                        </>

                        {isShowOption && <div onClick={e => e.stopPropagation()} className='absolute top-full flex-col flex left-[16px] bg-gray-100 border min-w-[150px] py-2'>
                            <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.MEMBER}/${path.PERSONAL}`}
                            >Personal
                            </Link>
                            {+current.role === 1 && <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.ADMIN}/${path.DASHBOARD}`}
                            >Admin Workspace
                            </Link>}
                            {+current.role === 2 && <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.PITCHOWNER}/${path.MANAGE_PITCHOWN}`}
                            >Pitch Owner Workspace
                            </Link>}
                        </div>}
                    </div>
                }
            </div>

        </div>
    )
}

export default memo(Header)