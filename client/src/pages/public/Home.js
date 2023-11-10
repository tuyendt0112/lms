import React from 'react'
import { Banner, Sidebar, BestPrice, DealDaily } from '../../components'

const Home = () => {

    return (
        <div className='w-main flex'>
            <div className='flex flex-col gap-5 w-[30%] flex-auto'>
                <Sidebar></Sidebar>
                <DealDaily></DealDaily>
            </div>
            <div className='flex flex-col gap-5 pl-5 w-[70%] flex-auto '>
                <Banner></Banner>
                <BestPrice></BestPrice>
            </div>
        </div>
    )
}

export default Home