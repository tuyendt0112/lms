import React from 'react'
import logo from '../assets/logo.png'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '..//ultils/path'

const Header = () => {
    const { RiPhoneFill, MdEmail, FaUserCircle } = icons
    return (
        <div className='border w-main flex justify-between h-[110px] py-[35px]'>
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
                <div className='flex items-center justify-center px-6'><FaUserCircle size={24}></FaUserCircle></div>
                <div></div>
            </div>
        </div>
    )
}

export default Header