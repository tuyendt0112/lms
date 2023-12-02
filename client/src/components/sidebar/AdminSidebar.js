import React, { Fragment, memo, useState } from 'react'
import logo from 'assets/logo.png'
import { adminSideBar } from 'ultils/constant'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaAngleDoubleDown, FaAngleDoubleRight } from 'react-icons/fa'

const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-blue-500'
const notactivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-blue-200'

const AdminSideBar = () => {
    const [actived, setActived] = useState([])

    // Check mảng nếu không có id trong mảng thì copy lại mảng và push id mới vào
    // Nếu đã có id thì lọc ra những id có trong mảng mà không phải id vừa chọn
    // Nhầm làm các tab trở nên riêng biệt với nhau (đóng tab này thì tab khác vẫn mở bth)
    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) {
            setActived(prev => prev.filter(el => el !== tabID))
        }
        else {
            setActived(prev => [...prev, tabID])
        }
    }
    // console.log(actived)
    return (
        <div className='bg-white h-full py-4'>
            <Link to={'/'} className='flex flex-col justify-center items-center p-4 gap-2'>
                <img src={logo} alt='logo' className='w-[200px] object-contain' />
                <small className='font-bold'>Admin WorkSpace</small>
            </Link>
            <div>
                {adminSideBar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' &&
                            <NavLink
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notactivedStyle)}
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        }
                        {el.type === 'PARENT' &&
                            <div onClick={() => handleShowTabs(+el.id)} className='flex flex-col'>
                                <div className='flex items-center justify-between px-4 py-2 hover:bg-blue-200 cursor-pointer'>
                                    <div className='flex items-center gap-2'>
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {
                                        actived.some(id => id === el.id) ? <FaAngleDoubleRight /> : < FaAngleDoubleDown />
                                    }
                                </div>
                                {actived.some(id => +id === +el.id) &&
                                    <div className='flex flex-col' >
                                        {el.submenu.map(item => (
                                            <NavLink
                                                key={el.text}
                                                to={item.path}
                                                onClick={e => e.stopPropagation()}
                                                className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notactivedStyle, 'pl-10')}
                                            >
                                                {item.text}
                                            </NavLink>
                                        ))}
                                    </div>}
                            </div>
                        }

                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSideBar)