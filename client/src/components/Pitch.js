import React, { useState } from 'react'
import defaultt from '../assets/default.png'
import { formatMoney } from '../ultils/helper'
import label from '../assets/label.png'
import label2 from '../assets/label2.png'
import { renderStarFromNumber } from '../ultils/helper'
import { SelectOption } from './'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons


const Pitch = ({ pitchData, isNew, normal }) => {
    const [isShowOption, setisShowOption] = useState(false)
    return (
        <div className='w-full text-base pr-[10px]'>
            <Link className='w-full border p-[15px] flex flex-col items-center'
                to={`/${pitchData?.category?.toLowerCase()}/${pitchData?._id}/${pitchData?.title}`}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setisShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setisShowOption(false)
                }}
            >
                <div className='w-full relative'>
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        <SelectOption icon={<AiFillEye></AiFillEye>}></SelectOption>
                        <SelectOption icon={<AiOutlineMenu></AiOutlineMenu>}></SelectOption>
                        <SelectOption icon={<BsFillSuitHeartFill></BsFillSuitHeartFill>}></SelectOption>
                    </div>}
                    <img src={pitchData?.images[0] || defaultt} alt="" className='w-[300px] h-[250px] object-cover'></img>
                    {!normal && <img src={isNew ? label2 : label} alt='' className={`absolute top-[-20px] left-[-20px] ${isNew ? 'w-[70px]' : 'w-[70px]'} h-[50px] object-cover`}></img>}
                    {!normal && <span className='font-bold  top-[-12px] left-[-10px] text-white absolute'>{isNew ? 'New' : 'Best'}</span>}
                </div>
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='flex h-4'>{renderStarFromNumber(pitchData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1'>{pitchData?.title}</span>
                    <span>{`${formatMoney(pitchData?.price)} VNĐ`}</span>
                </div>
            </Link>
        </div>
    )
}

export default Pitch