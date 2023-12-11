import React from 'react'
import { Banner, Sidebar, BestPrice, DealDaily, FeaturePitch, CustomSlider } from '../../components'
import { useSelector } from 'react-redux'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import defaultImage from 'assets/default.png'
const { IoIosArrowForward } = icons
const Home = () => {
    const { newPitches } = useSelector(state => state.pitch)
    const { categories } = useSelector(state => state.app)
    const { isLoggedIn, current } = useSelector(state => state.user)
    return (
        <>

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
            <div className='w-main my-8'>
                <FeaturePitch></FeaturePitch>
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-blue-700'>NEW ARRIVALS</h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider
                        pitches={newPitches}
                    ></CustomSlider>
                </div>
            </div>
            <div className="my-8 w-main">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-blue-700">
                    HOT PITCHES
                </h3>
                {/* <div className='flex flex-wrap gap-x-24 gap-y-8 mt-4 min-h-[190px]'>
                    {categories?.filter(el => el.brands.length > 0).map(el => (
                        <div
                            key={el._id}
                            className='w-[396px]'
                        >
                            <div className='border flex p-4 gap-4'>
                                <img src={el?.thumb} alt='' className='w-[144px] flex-1 h-[129px] object-cover'></img>
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase'>{el.title}</h4>
                                    <ul className='text-sm'>
                                        {el?.brands?.map(item => (
                                            <span key={item} className='flex gap-1 items-center'>
                                                <IoIosArrowForward size={14}></IoIosArrowForward>
                                                <li>{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {categories
                        ?.filter((el) => el.brands.length > 0)
                        .map((el) => (
                            <div key={el._id} className="w-[680px]">
                                <div className="border flex">
                                    <img
                                        src={el?.image || defaultImage}
                                        alt="picture category"
                                        className="w-[250px] flex-1 h-[250px] object-cover"
                                    />
                                    <div className="flex-1 text-black-700">
                                        <h4 className="font-semibold uppercase ml-10 mt-3">
                                            {el.title}
                                        </h4>
                                        <ul className="text-sm mt-4 ml-4 ">
                                            {el?.brands?.map((item) => (
                                                <span key={item + 1} className="flex gap-1 items-center">
                                                    <IoIosArrowForward size={14} />
                                                    <Link
                                                        to={`/${el.title.toLowerCase()}/${item.toLowerCase()}`}
                                                    >
                                                        {item}
                                                    </Link>
                                                </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Home