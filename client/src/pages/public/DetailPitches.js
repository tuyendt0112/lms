import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetPitch, apiGetPitches } from '../../apis'
import { Breadcrumb, Button, PitchExtraInfo, PitchInformation, CustomSlider } from '../../components'
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from '../../ultils/helper'
import { pitchExtraInformation } from '../../ultils/constant';


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
  const [realtedPitches, setrealtedPitches] = useState(null)
  const fetchPitchData = async () => {
    const response = await apiGetPitch(pid)
    if (response.success) setpitch(response.pitchData)
  }
  const fetchPitches = async () => {
    const response = await apiGetPitches()
    if (response.success) setrealtedPitches(response.pitches)
  }
  useEffect(() => {
    if (pid) {
      fetchPitchData()
      fetchPitches()
    }
  }, [pid])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>{title}</h3>
          <Breadcrumb title={title} category={category}></Breadcrumb>
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='flex flex-col gap-3 w-2/5 '>
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
        <div className='w-2/5 pr-[24px] gap-4'>
          <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(pitch?.price))} VNĐ`}</h2>
          <div className='flex items-center mt-4'>
            {renderStarFromNumber(pitch?.totalRatings)?.map(el => (<span key={el}>{el}</span>))}
          </div>
          <h2 className='font-semibold'>Description</h2>
          <ul className='list-item'>
            {pitch?.description}
          </ul>
          <h2 className='font-semibold'>Address</h2>
          <ul className='list-item'>
            {pitch?.address}
          </ul>
          <div>
            <Button
              name='Booking'
              fw
            >
            </Button>
          </div>
        </div>
        <div className='w-1/5'>
          {
            pitchExtraInformation.map(el => (
              <PitchExtraInfo
                key={el.id}
                title={el.title}
                icon={el.icon}
                sub={el.sub}
              ></PitchExtraInfo>
            ))
          }
        </div>
      </div>
      <div className='w-main m-auto mt-8'>
        <PitchInformation></PitchInformation>
      </div>
      <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKED</h3>
        <CustomSlider normal={true} pitches={realtedPitches}></CustomSlider>
      </div >
      <div className='h-[100px] w-full'></div>
    </div >
  )
}

export default DetailPitches