import { Breadcrumb } from 'components'
import React from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'

const DetailNotification = () => {
    const { notification } = useParams()
    console.log(notification)
    return (
        <div>
            <Breadcrumb category='notification' brand={notification}  ></Breadcrumb>
            <div>DetailNotification</div>
        </div>

    )
}

export default DetailNotification