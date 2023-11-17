import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetPitch } from '../../apis'
import { Breadcrumb } from '../../components'
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';


const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};

const DetailPitches = () => {

  const { pid, title, category } = useParams()
  const [pitch, setpitch] = useState(null)
  const fetchPitchData = async () => {
    const response = await apiGetPitch(pid)
    if (response.success) setpitch(response.pitchData)
  }
  useEffect(() => {
    if (pid) fetchPitchData()
  }, [pid])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3>{title}</h3>
          <Breadcrumb title={title} category={category}></Breadcrumb>
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='flex flex-col gap-4 w-2/5 '>
          <img src={pitch?.images[0]} alt='pitch' className='border h-[458px] w-[470px] object-cover'></img>
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {pitch?.images?.map(el => (
                <div className='flex w-full gap-2' key={el}>
                  <img src={el} alt='sub-pitch' className='h-[143px] w-[150px] border object-cover'></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='border w-2/5'>
          price
        </div>
        <div className='border w-1/5'>
          information
        </div>
      </div>
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default DetailPitches