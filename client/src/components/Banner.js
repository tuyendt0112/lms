import React from 'react'
import banner from '../assets/banner1.jpg'

const Banner = () => {
  return (
    <div className='w-full'>
      <img src={banner} alt="banner" className='w-full object-contain'></img>
    </div>
  )
}

export default Banner