import React, { useState, useEffect } from 'react'
import { apiGetPitches } from '../apis/pitch'
import { Pitch } from './'
import Slider from "react-slick";

const tabs = [
    { id: 1, name: 'best price' },
    { id: 2, name: 'new pitches' },
]
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};
const BestPrice = () => {
    const [bestSellers, setbestSellers] = useState(null)
    const [newPitches, setnewPitches] = useState(null)
    const [activedTab, setactivedTab] = useState(0)
    const fetchPitches = async () => {
        const response = await Promise.all([apiGetPitches({ sort: '-price' }), apiGetPitches({ sort: '-createdAt' })])
        if (response[0]?.success) setbestSellers(response[0].pitches)
        if (response[1]?.success) setnewPitches(response[1].pitches)

    }
    useEffect(() => {
        fetchPitches()
    }, [])
    return (
        <div>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-main'>
                {tabs.map(el => (
                    <span key={el.id}
                        className={`font-bold capitalize border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setactivedTab(el.id)}

                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4'>
                <Slider {...settings}>
                    {bestSellers?.map(el => (
                        <Pitch
                            key={el.id}
                            pitchData = {el}
                        >
                        </Pitch>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default BestPrice