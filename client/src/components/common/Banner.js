import React, { memo } from 'react'
import { ImageSlider } from 'components'
import banner1 from 'assets/banner1.jpg'
import banner2 from 'assets/banner2.jpg'
import banner3 from 'assets/banner3.jpg'
import banner4 from 'assets/banner4.jpg'

const imageArray = [banner1, banner2, banner3, banner4];

const Banner = () => {
  return (
    <div className='w-full'>
      <ImageSlider imageArray={imageArray} intervalMinutes={0.05} style='h-[391px]' />
    </div>
  )
}

export default memo(Banner)