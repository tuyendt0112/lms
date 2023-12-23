import React, { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";

import icons from 'ultils/icons'

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons
const Pitch = ({ pitchData, isNew, normal, navigate, dispatch, pid }) => {
    navigate = useNavigate();
    dispatch = useDispatch();
    return (
        <div className="w-full text-base pr-[10px]">
            <div
                className="w-full border p-[15px] flex flex-col items-center" onClick={(e) =>
                    navigate(
                        `/${pitchData?.category?.toLowerCase()}/${pitchData?.brand?.toLowerCase()}/${pitchData?._id
                        }/${pitchData?.title}`
                    )
                }
                onMouseEnter={(e) => {
                    e.stopPropagation();
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                }}>
                <div className="w-full relative flex flex-col">

                    <span className="line-clamp-1">
                        <label className='font-bold'>Title of the topics: </label>
                        {pitchData?.title}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Major: </label>
                        {pitchData?.major}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Department: </label>
                        {pitchData?.department}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Instructor: </label>
                        {pitchData?.instructors?.firstname} {pitchData?.instructors?.lastname}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Date Start: </label>
                        {moment(pitchData?.DateStart).format("DD/MM/YYYY")}
                        <label className='font-bold ml-2'>Date End: </label>
                        {moment(pitchData?.DateEnd).format("DD/MM/YYYY")}
                    </span>

                </div>
            </div>
        </div>
    );
};

export default memo(Pitch)