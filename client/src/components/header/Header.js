import React, { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { showOrder } from 'store/app/appSilice'
import path from 'ultils/path'
import avatar from 'assets/defaultava.png'
import logo from 'assets/logo.png'
import icons from 'ultils/icons'

const { BsCart } = icons
const Header = () => {
    const { current } = useSelector(state => state.user)
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
    return (
        <div className='w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>
            <div className='flex text-[13px]'>
                {current &&
                    <div
                        className='flex items-center justify-center px-6 gap-2 relative'
                        id='profile'
                    >
                        <div
                            className="flex items-center gap-1 cursor-pointer "
                            onClick={() => dispatch(showOrder())}
                        >
                            <span className="font-semibold hover:text-blue-500">Booking</span>
                            <BsCart size={24} className="text-blue-900" />
                        </div>
                        <div
                            className='flex items-center cursor-pointer'
                            onClick={() => setisShowOption(prev => !prev)}
                        >
                            <span className='font-semibold hover:text-blue-500'>Profile</span>
                            <label htmlFor='file'>
                                <img src={current?.avatar || avatar} alt='avatar' className='w-7 h-7 ml-2 object-cover rounded-full cursor-pointer'></img>
                            </label>
                        </div>
                        {isShowOption && <div onClick={e => e.stopPropagation()} className='absolute top-full flex-col flex left-[90px] bg-gray-100 border min-w-[150px] py-2 rounded-md'>
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