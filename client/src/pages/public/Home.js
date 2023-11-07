import React from 'react'
import { Header, Banner, Navigation, Sidebar } from '../../components'

const Home = () => {
    return (
        <div className='w-main flex'>
            <div className='flex flex-col gap-5 w-[25%] flex-auto border'>
                <Sidebar></Sidebar>
            </div>
            <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto border'>
                <Banner></Banner>
            </div>
        </div>
    )
}

export default Home