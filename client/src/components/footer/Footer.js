import React, { memo } from 'react'
import icons from 'ultils/icons'

const { MdEmail } = icons
const Footer = () => {
    return (
        <div className='w-full'>
            <div className='h-[103px] w-full bg-blue-900 flex items-center justify-center'>
                <div className='w-main flex items-center justify-between'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>SIGN UP TO BOOKING PITCHES</span>
                        <small className='text-[13px] text-gray-300'>Receive weekly football news</small>
                    </div>
                    <div className='flex-1 flex ỉtems-center'>
                        <input type='text'
                            className='p-4 pr-0 rounded-l-full w-full bg-white outline-none text-black placeholder:text-sm 
                        placeholder:text-black placeholder:italic placeholder:opacity-50'
                            placeholder='Email address'
                        ></input>
                        <div className='h-[56px] w-[56px] bg-blue-700 rounded-r-full flex items-center justify-center text-white'>
                            <MdEmail size={18}></MdEmail>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[407px] w-full bg-gray-800 flex items-center justify-center text-white text-[13px]' >
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
                            <span className='opacity-70'>debugboy@gmail.com</span>
                        </span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>INFORMATION</h3>
                        <span>Gallery</span>
                        <span>Store Location</span>
                        <span>Today's Deals</span>
                        <span>Contact</span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>WHO WE ARE</h3>
                        <span>Help</span>
                        <span>FAQs</span>
                        <span>Return & Exchange</span>
                        <span>Contact</span>
                    </div>
                    <div className='flex-1'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-blue-900 pl-[15px]'>#BOOKINGPITCHESWEBSITE</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)