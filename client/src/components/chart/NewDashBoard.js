import React, { useEffect, useState } from 'react'
import { IoBagHandle, IoPieChart, IoPeople, IoCart, IoFootballOutline } from 'react-icons/io5'
import { apiGetPitches, apiGetUsers, apiGetAllOrder } from 'apis'
import { BoxWrapper } from 'ultils/helper'


const NewDashBoard = () => {

    const [pitches, setpitches] = useState(null)
    const [user, setuser] = useState(null)
    const [order, setorder] = useState(null)


    const fetchProducts = async () => {
        const response = await apiGetPitches()
        if (response.success) setpitches(response)
    }
    const fetchUsers = async () => {
        const response = await apiGetUsers()
        if (response.success) setuser(response)
    }
    const fetchOrders = async () => {
        const response = await apiGetAllOrder()
        if (response.success) setorder(response)
    }



    useEffect(() => {
        fetchProducts()
        fetchUsers()
        fetchOrders()
    }, [])
    return (
        <div className="flex gap-4 pt-2">
            <div className='w-1/3 bg-gray-700'>
                <BoxWrapper >
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
                        <IoFootballOutline className="text-2xl text-black" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-300 font-light ">Total Pitch</span>
                        <div className="flex items-center">
                            <strong className="text-xl text-white font-semibold">{pitches?.totalCount}</strong>
                            {/* <span className="text-sm text-green-500 pl-2">+343</span> */}
                        </div>
                    </div>
                </BoxWrapper>
            </div>

            <div className='w-1/3'>
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
                        <IoPeople className="text-2xl text-black" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-300 font-light">Total User</span>
                        <div className="flex items-center">
                            <strong className="text-xl text-white font-semibold">{user?.counts}</strong>
                            {/* <span className="text-sm text-red-500 pl-2">-30</span> */}
                        </div>
                    </div>
                </BoxWrapper>
            </div>
            <div className='w-1/3'>
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
                        <IoCart className="text-2xl text-black" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-300 font-light">Total Orders</span>
                        <div className="flex items-center">
                            <strong className="text-xl text-white font-semibold">{order?.totalCount}</strong>
                            {/* <span className="text-sm text-red-500 pl-2">-43</span> */}
                        </div>
                    </div>
                </BoxWrapper>
            </div>

        </div>
    )
}

export default NewDashBoard