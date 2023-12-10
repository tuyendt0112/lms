import React, { useState, useEffect, memo } from 'react'
import icons from 'ultils/icons'
import { apiGetPitches } from 'apis/pitch'
import defaultt from 'assets/default.png'
import { formatMoney } from 'ultils/helper'
import { renderStarFromNumber } from 'ultils/helper'
import CountDown from 'components/common/CountDown'
import ImageSlider from 'components/common/ImageSlider'


import poster01 from "assets/poster.jpg";
import poster02 from "assets/poster02.jpg";
import poster03 from "assets/poster03.jpg";
import poster04 from "assets/poster04.jpg";
import poster05 from "assets/poster05.jpg";
import poster06 from "assets/poster06.jpg";
import { Link, useNavigate } from 'react-router-dom'
import path from 'ultils/path'
import Button from 'components/buttons/Button'
const { AiFillStar, AiOutlineMenu } = icons
let idInterval
const imageArray = [poster01, poster02, poster03, poster04, poster05, poster06];

const DealDaily = () => {
    const navigate = useNavigate();
    const [dealdaily, setdealdaily] = useState(null)
    const [hour, sethour] = useState(0)
    const [minute, setminute] = useState(0)
    const [second, setsecond] = useState(0)
    const [expireTime, setexpireTime] = useState(false)

    const fetchDealDaily = async () => {
        const response = await apiGetPitches({ limit: 1, page: Math.round(Math.random() * 6) })
        if (response.success) {
            setdealdaily(response.pitches[0])
            const h = 24 - new Date().getHours()
            const m = 60 - new Date().getMinutes()
            const s = 60 - new Date().getSeconds()
            sethour(h)
            setminute(m)
            setsecond(s)
        } else {
            sethour(0)
            setminute(59)
            setsecond(59)
        }

    }
    // useEffect(() => {
    //     fetchDealDaily()
    // }, [])
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()
    }, [expireTime])
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setsecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setminute(prev => prev - 1)
                    setsecond(59)
                } else {
                    if (hour > 0) {
                        sethour(prev => prev - 1)
                        setminute(59)
                        setsecond(59)
                    } else {
                        setexpireTime(!expireTime)
                    }
                }

            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])

    return (
        <div className='border w-full h-[731px] flex flex-col gap-2'>
            <div className=''>
                <div className='flex items-center justify-between p-2 w-full'>
                    <span className='flex-1 flex justify-center'><AiFillStar size={20} color='blue'></AiFillStar></span>
                    <span className='flex-8 font-bold text-[20px] flex justify-center'>DEAL DAILY</span>
                    <span className='flex-1'></span>
                </div>
                <div className='w-full flex flex-col items-center pt-8 px-4 gap-2'>
                    <img src={dealdaily?.thumb || defaultt} alt="" className='w-full h-[200px] object-cover'></img>
                    <span className='line-clamp-1 text-center'>{dealdaily?.title}</span>
                    <span className='flex '>{renderStarFromNumber(dealdaily?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatMoney(dealdaily?.price)} VNĐ`}</span>
                </div>
                <div className='px-4 mt-4'>
                    <div className='flex justify-center gap-2 items-center mb-6'>
                        <CountDown unit={'Hours'} number={hour}></CountDown>
                        <CountDown unit={'Minutes'} number={minute}></CountDown>
                        <CountDown unit={'Seconds'} number={second}></CountDown>
                    </div>

                    <Button
                        type="button"

                        handleOnClick={() =>
                            navigate(
                                `/${dealdaily?.category?.toLowerCase()}/${dealdaily?.brand?.toLowerCase()}/${dealdaily?._id
                                }/${dealdaily?.title}`
                            )
                        }
                        style='flex w-full gap-2 items-center justify-center  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md
                        shadow-indigo-800/100 hover:shadow-indigo-700/80 text-white font-medium py-2 rounded-md'
                    >

                        <AiOutlineMenu></AiOutlineMenu>
                        <span>Option</span>
                    </Button>
                </div>
            </div>
            <div >
                <ImageSlider imageArray={imageArray} intervalMinutes={0.05} style='h-[245px]' />
            </div>
        </div>
    )
}

export default memo(DealDaily)