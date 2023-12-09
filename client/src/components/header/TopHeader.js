import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrent } from 'store/user/asyncAction'
import { useDispatch, useSelector } from 'react-redux'
import { logout, clearMessage } from 'store/user/userSlice'
import Swal from 'sweetalert2'
import icons from 'ultils/icons'
import path from 'ultils/path'

const { AiOutlineLogout } = icons

const TopHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrent())
        }, 300)
        return () => {
            clearTimeout(setTimeoutId)
        }
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (mes) {
            Swal.fire('Oops!', mes, 'info').then(() => {
                dispatch(clearMessage())
                navigate(`/${path.LOGIN}`)
            })
        }
    }, [mes])
    return (
        <div className='w-full bg-gradient-to-r from-login to-login-2 flex items-center justify-center '>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span></span>
                {isLoggedIn && current
                    ? <div className='flex gap-4 text-sm items-center'>
                        <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                        <span onClick={() => dispatch(logout())}
                            className='hover:rounded-full hover:bg-gray-200 cursor-auto hover:text-main p-2'>
                            <AiOutlineLogout size={18}></AiOutlineLogout> </span>
                    </div>
                    : <Link className='text-lg font-bold hover:text-gray-800' to={`/${path.LOGIN}`}>Sign In or Create Account</Link>
                }
            </div>
        </div>
    )
}

export default memo(TopHeader)