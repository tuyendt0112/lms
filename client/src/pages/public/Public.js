import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation, TopHeader, Footer, Loader } from 'components'

const Public = () => {
    const [isLoading, setIsLoading] = useState(true);
    // Let create async method to fetch fake data
    useEffect(() => {
        const fakeDataFetch = () => {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        };

        fakeDataFetch();
    }, []);

    return (
        // isLoading ? (
        //     <Loader />
        // ) : (
        //     <div className='max-h-screen flex flex-col items-center'>
        //         <TopHeader></TopHeader>
        //         <Header></Header>
        //         <Navigation></Navigation>
        //         <div className='w-full flex items-center flex-col'>
        //             <Outlet></Outlet>
        //         </div>
        //         <Footer></Footer>
        //     </div>
        // )
        <div className='max-h-screen flex flex-col items-center'>
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