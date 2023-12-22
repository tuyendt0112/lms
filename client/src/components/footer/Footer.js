import React, { memo } from 'react'
import icons from 'ultils/icons'
import { FaFacebookF } from "react-icons/fa";
import logo3 from 'assets/logohcmute3.png'
import path from 'ultils/path'
import { Link } from 'react-router-dom'

const { MdEmail } = icons
const Footer = () => {
    return (
        <div className='w-full'>
            <div className='h-[103px] w-full bg-blue-900 flex items-center justify-center'>
                <div className='w-main flex items-center justify-between'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>WELCOME TO HCMUTE</span>
                        <small className='text-[13px] text-gray-300'>HCMC UNIVERSITY OF TECHNOLOGY AND EDUCATION</small>
                    </div>
                    <div className='text-3xl transition duration-500 hover:scale-125 hover:translate-y-2 hover:-translate-x-5 cursor-pointer transform'>
                        <Link to={`/${path.HOME}`}>
                            <img src={logo3} alt="logo" className='w-[200px] object-contain ' />
                        </Link>
                    </div>
                    {/* <div className='flex-1 flex ỉtems-center'>
                        <input type='text'
                            className='p-4 pr-0 rounded-l-full w-full bg-white outline-none text-black placeholder:text-sm 
                        placeholder:text-black placeholder:italic placeholder:opacity-50'
                            placeholder='Email address'
                        ></input>
                        <div className='h-[56px] w-[56px] bg-blue-700 rounded-r-full flex items-center justify-center text-white'>
                            <MdEmail size={18}></MdEmail>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='h-[250px] w-full bg-gray-800 flex items-center justify-center text-white text-[13px]' >
                <div className='w-main flex'>
                    <div className='flex-2 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>ABOUT US</h3>
                        <span>
                            <span>Address: </span>
                            <span className='opacity-70'>Number 1 Vo Van Ngan Street , Thu Duc Distric</span>
                        </span>
                        <span>
                            <span>Phone: </span>
                            <span className='opacity-70'>(+84) 09090909</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className='opacity-70'>hcmute@gmail.com</span>
                        </span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>INFORMATION</h3>
                        <span>Gallery</span>
                        <span>Location</span>
                        <span>Contact</span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>WHO WE ARE</h3>
                        <span>Help</span>
                        <span>FAQs</span>
                        <span>Contact</span>
                    </div>
                    <div className='flex-1'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>#HCMUTE</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)