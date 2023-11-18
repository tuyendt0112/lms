import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation, TopHeader, Footer } from '../../components'

const Public = () => {
    return (
        <div className='w-full flex flex-col items-center'>
            <TopHeader></TopHeader>
            <Header></Header>
            <Navigation></Navigation>
            <div className='w-full flex items-center flex-col'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Public