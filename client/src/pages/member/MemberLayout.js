import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'ultils/path'
import { useSelector } from 'react-redux'
import { Membersidebar } from 'components'

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    const [open, setOpen] = useState(true)
    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='flex w-full bg-gray-100 min-h-screen relative text-gray-800'>
            <div className='top-0 bottom-0 flex-none fixed'>
                <Membersidebar open={open} setOpen={setOpen} />
            </div>
            <div className={`duration-700 ${open ? 'w-72' : 'w-20'}`}></div>
            <div className='flex-auto '>
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout