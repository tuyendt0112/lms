import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { createSlug } from 'ultils/helper'
import { useSelector } from 'react-redux'
import { formattedCategory } from 'ultils/helper'
const Sidebar = () => {
  const { categories } = useSelector(state => state.app)

  return (
    <div className='flex flex-col border'>
      {categories?.map(el => (
        <NavLink
          key={formattedCategory(el.title)}
          to={formattedCategory(el.title)}
          className={({ isActive }) => isActive
            ? 'bg-main text-white px-5 pt -[25px] pb-[20px] text-sm hover:text-main'
            : 'px-5 pt-[25px] pb-[20px] text-sm hover:text-main'}
        >
          {el.title}
        </NavLink>
      ))}
    </div >
  )
}


export default memo(Sidebar)