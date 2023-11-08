import React, { useEffect, useState } from 'react'
import { Header, Banner, Navigation, Sidebar, BestPrice } from '../../components'

const Home = () => {

    return (
        <div className='w-main flex'>
            <div className='flex flex-col gap-5 w-[25%] flex-auto border'>
                <Sidebar></Sidebar>
            </div>
            <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto border'>
                <Banner></Banner>
                <BestPrice></BestPrice>
            </div>
        </div>
    )
}

export default Home