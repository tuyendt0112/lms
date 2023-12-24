import { apiGetNotification } from 'apis'
import { Breadcrumb } from 'components'
import DOMPurify from 'dompurify'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams, Link } from 'react-router-dom'
const DetailNotification = () => {
    const { nid } = useParams()
    const [notificationData, setNotificationData] = useState(null)
    const fetchNotification = async () => {
        const response = await apiGetNotification(nid)
        if (response.success) {
            setNotificationData(response.mes)
        }
    }
    useEffect(() => {
        fetchNotification()
    }, [])
    console.log(notificationData?.title)
    return (
        <div className="w-full ">
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>Notification</h3>
                    <Breadcrumb category='notification' brand={notificationData?.title} ></Breadcrumb>
                </div>
            </div>
            <div className='flex justify-center items-center py-4'>
                <div className='flex flex-col gap-4 w-main'>
                    <div className='flex flex-col gap-2'>
                        <span className="font-bold text-xl text-blue-700 ">{notificationData?.title}</span>
                        <div
                            className="text-sm line-clamp-[15] "
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(notificationData?.content[0]),
                            }}
                        ></div>
                        <Link to={notificationData?.file}>
                            <span className='text-blue-700 underline'>Xem Chi Tiết Hơn</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default DetailNotification