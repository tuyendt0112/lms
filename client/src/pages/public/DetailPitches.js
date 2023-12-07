import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetPitch, apiGetPitches } from '../../apis'
import { Breadcrumb, Button, PitchExtraInfo, PitchInformation, CustomSlider } from '../../components'
import Slider from "react-slick"
import ReactImageMagnify from 'react-image-magnify'
import { formatMoney, formatPrice, renderStarFromNumber } from '../../ultils/helper'
import { pitchExtraInformation } from '../../ultils/constant'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import Select from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { shifts } from 'ultils/constant'
import icons from 'ultils/icons'
import { formattedCategory } from 'ultils/helper'
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
}

const { FaCalendarAlt } = icons
const DetailPitches = ({ isQuickView, data }) => {

  const [pitch, setpitch] = useState(null)
  const [selectedShift, setSelectedShift] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentImage, setcurrentImage] = useState(null)
  const [realtedPitches, setrealtedPitches] = useState(null)
  const [update, setUpdate] = useState(false)
  //
  const params = useParams()
  const { title } = useParams()
  const [pid, setpitchid] = useState(null)
  const [category, setpitchcategory] = useState(null)
  const handleClickBooking = (data) => {
    console.log("handleClickBooking is called");
    console.log("Selected Shift:", selectedShift);
    console.log("Selected Date:", selectedDate);
  };
  useEffect(() => {
    if (data) {
      setpitchid(data.pid)
      setpitchcategory(data.category)
    }
    else if (params && params.pid) {
      setpitchid(params.pid)
      setpitchcategory(params.category)
    }
  }, [data, params])

  const fetchPitchData = async () => {
    const response = await apiGetPitch(pid)
    if (response.success) {
      setpitch(response.pitchData)
      setcurrentImage(response.pitchData?.images[0])
    }
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
    window.scrollTo(0, 0)
  }, [pid])
  useEffect(() => {
    if (pid) {
      fetchPitchData()
    }
  }, [update])

  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const handleClickimage = (e, el) => {
    e.stopPropagation()
    setcurrentImage(el)
  }
  console.log(pitch)
  return (
    <div className={clsx('w-full')}>
      {!isQuickView && <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>{title}</h3>
          <Breadcrumb title={title} category={category}></Breadcrumb>
        </div>
      </div>}
      <div onClick={e => e.stopPropagation()} className={clsx('bg-white m-auto mt-4 flex', isQuickView ? 'max-w-[900px] gap-16 p-8' : 'w-main')}>
        <div className={clsx('flex flex-col gap-3 w-2/5 ', isQuickView && 'w-1/2')}>
          <img src={currentImage} alt='pitch' className='border h-[458px] w-[470px] object-cover' />
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {pitch?.images?.map(el => (
                <div className='flex w-full gap-2' key={el}>
                  <img onClick={e => handleClickimage(e, el)} src={el} alt='sub-pitch' className='h-[143px] w-[150px] cursor-pointer border object-cover'></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 pr-[24px] gap-4'>
          <h2 className="text-[30px] font-semibold">{pitch?.title}</h2>
          <h3 className="text-[30px] font-semibold">{`${formatMoney(
            formatPrice(pitch?.price)
          )} VNĐ`}</h3>
          <div className='flex items-center mt-2'>
            {renderStarFromNumber(pitch?.totalRatings, 24)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </div>
          <h2 className="font-semibold pt-2">Brand:</h2>
          <span>{pitch?.brand} </span>
          <h2 className="font-semibold pt-2  ">Description:</h2>
          {/* <ul className='list-item'>
            <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pitch?.description) }}></div>
          </ul> */}
          <ul className="list-square text-sm text-gray-500">
            {pitch?.description?.length > 1 &&
              pitch?.description?.map((el) => (
                <li className="leading-6" key={el}>
                  {el}
                </li>
              ))}
            {pitch?.description?.length === 1 && (
              <div
                className="text-sm line-clamp-[15] "
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(pitch?.description[0]),
                }}
              ></div>
            )}
          </ul>
          <h2 className="font-semibold pt-2">Address:</h2>
          <ul className="list-item text-sm text-gray-500">{pitch?.address}</ul>
          <div>
            <h2 className="font-semibold">Shift:</h2>
            <Select
              id="shift"
              options={shifts?.map((st) => ({
                label: st.time,
                value: st.value,
              }))}
              isMulti
              placeholder={"Select Shift Book"}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(
                  (option) => option.value
                );
                setSelectedShift(selectedValues);
              }}
            />
          </div>
          <div>
            <h2 className="font-semibold">Date:</h2>
            <div className="border font-bold mb-4 p-2 flex items-center">
              <FaCalendarAlt className="mr-2" />
              {/* <ChooseDate /> */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                // minDate={new Date()}
                placeholderText="Select Date Book"
              // showPopperArrow={false}
              // className="w-full border-none outline-none"
              // popperClassName="datepicker-popper"
              />
            </div>
          </div>
          <div>
            <Button
              fw
              handleOnClick={handleClickBooking}
            >
              Booking
            </Button>
          </div>
        </div>
        {!isQuickView && <div className='w-1/5'>
          {
            pitchExtraInformation.map(el => (
              <PitchExtraInfo
                key={el.id}
                title={el.title}
                icon={el.icon}
                sub={el.sub}
              />
            ))
          }
        </div>}
      </div>
      {!isQuickView && <div className='w-main m-auto mt-8'>
        <PitchInformation
          totalRatings={pitch?.totalRatings}
          ratings={pitch?.ratings}
          namePitch={pitch?.title}
          pid={pitch?._id}
          rerender={rerender}
        />
      </div>}
      {!isQuickView && <>
        <div className='w-main m-auto mt-8'>
          <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKED</h3>
          <CustomSlider normal={true} pitches={realtedPitches}></CustomSlider>
        </div >
        <div className='h-[100px] w-full'></div>
      </>}
    </div >
  )
}

export default DetailPitches