import React, { memo, useState } from 'react'
import { formatMoney } from 'ultils/helper'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from 'store/app/appSilice'
import { DetailPitches } from 'pages/public'
import { renderStarFromNumber } from 'ultils/helper'
import label from 'assets/label.png'
import label2 from 'assets/label2.png'
import defaultt from 'assets/default.png'
import SelectOption from 'components/search/SelectOption'
import icons from 'ultils/icons'
import { toast } from 'react-toastify';
import { apiUpdateWishlist } from 'apis'
import { getCurrent } from 'store/user/asyncAction'

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons
const Pitch = ({ pitchData, isNew, normal, navigate, dispatch, pid }) => {
    const { current } = useSelector(state => state.user)
    const [isShowOption, setisShowOption] = useState(false)
    navigate = useNavigate()
    dispatch = useDispatch()
    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'MENU') navigate(`/${pitchData?.category?.toLowerCase()}/${pitchData?.brand?.toLowerCase()}/${pitchData?._id}/${pitchData?.title}`)
        if (flag === 'QUICK_VIEW') {
            dispatch(showModal({
                isShowModal: true, modalChildren: <DetailPitches data={{
                    pid: pitchData?._id,
                    category: pitchData?.category
                }} isQuickView></DetailPitches>
            }))
        }
        if (flag === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid)
            if (response.success) {
                dispatch(getCurrent())
                toast.success(response.message)

            } else toast.error(response.messsage)
        }

    }
    return (
        <div className='w-full text-base pr-[10px]'>
            <div className='w-full border p-[15px] flex flex-col items-center'
                onClick={e => navigate(`/${pitchData?.category?.toLowerCase()}/${pitchData?.brand?.toLowerCase()}/${pitchData?._id}/${pitchData?.title}`)}
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
                        <span onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}><SelectOption icon={<AiFillEye></AiFillEye>}></SelectOption></span>
                        <span onClick={(e) => handleClickOptions(e, 'MENU')}><SelectOption icon={<AiOutlineMenu></AiOutlineMenu>}></SelectOption></span>
                        <span onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                            <SelectOption
                                icon=
                                {<BsFillSuitHeartFill
                                    color={current?.wishlist?.some((i) => i === pid)
                                        ? "red" : "black"
                                    }>
                                </BsFillSuitHeartFill>
                                }>
                            </SelectOption>
                        </span>
                    </div>}
                    <img src={pitchData?.thumb || defaultt} alt="" className='w-[450px] h-[250px] object-cover'></img>
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
            </div>
        </div>
    )
}

export default memo(Pitch)