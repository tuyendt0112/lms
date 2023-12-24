import React, { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";

import icons from 'ultils/icons'

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons
const Lecturer = ({ pitchData, isNew, normal, navigate, dispatch, pid }) => {
    navigate = useNavigate();
    dispatch = useDispatch();
    console.log(pitchData)
    return (
        <div className="w-full text-base pr-[10px]">
            <div className="w-full border p-[15px] flex flex-col items-center" >
                <div className="w-full relative flex flex-col">
                    <span className="line-clamp-1">
                        <label className='font-bold'>Lecturer name: </label>
                        {pitchData?.firstname} {pitchData?.lastname}
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
                        <label className='font-bold'>Email: </label>
                        {pitchData?.email}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Phone Number: </label>
                        {pitchData?.phoneNumber}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Lecturer