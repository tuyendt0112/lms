import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination, Breadcrumb } from "components";
import { useForm } from "react-hook-form";
import { apiGetAllNotification, apiDeleteNotification } from "apis";
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
    Link,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import path from "ultils/path";
const Instruction = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [notifications, setNotifications] = useState(null)
    const [detail, setOnDetail] = useState(null)
    const fetchNotifitcation = async (params) => {
        const response = await apiGetAllNotification({
            ...params,
        })
        if (response.success) {
            setNotifications(response.Notifications)
        }
    }

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchNotifitcation(searchParams)
    }, [params])

    const handleOnClick = (data) => {
        navigate(`/notification/${data?._id}`)
    }
    console.log(notifications)
    return (

        <div className="w-full ">
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>Notification</h3>
                    <Breadcrumb category='notification' ></Breadcrumb>
                </div>
            </div>
            <div className='flex justify-center items-center py-4'>
                <div className='flex flex-col gap-4 w-main'>
                    <Link to={`https://drive.google.com/file/d/0B-pUp8vuvCF-Zm5QMEpFcERHWkE/view?resourcekey=0-vRNPHmrtmDRYy86tNj0K1w`} className="text-red-500 cursor-pointer text-2xl">File Hướng Dẫn Sử Dụng Website</Link>
                </div>
            </div>
        </div>
    )
}


export default Instruction