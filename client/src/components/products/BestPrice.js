import React, { useState, useEffect, memo } from 'react'
import { apiGetPitches } from 'apis/pitch'
import CustomSlider from 'components/common/CustomSlider';
import banner from 'assets/banner.jpg'
import banner2 from 'assets/banner2.jpg'
import { getNewPitches } from 'store/pitch/asyncAction'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';


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
    const [activedTab, setactivedTab] = useState(1)
    const [pitchs, setpitchs] = useState(null)
    const dispatch = useDispatch()
    const { newPitches } = useSelector(state => state.pitch)
    const { isShowModal } = useSelector(state => state.app)


    const fetchPitches = async () => {
        const response = await apiGetPitches({ sort: 'price' })
        if (response.success) {
            setbestSellers(response.pitches)
            setpitchs(response.pitches)
        }

    }
    useEffect(() => {
        fetchPitches()
        dispatch(getNewPitches())
    }, [])
    useEffect(() => {
        if (activedTab === 1) setpitchs(bestSellers)
        if (activedTab === 2) setpitchs(newPitches)
    }, [activedTab])
    return (
        <div className={clsx(isShowModal ? 'hidden' : '')}>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-blue-700'>
                {tabs.map(el => (
                    <span key={el.id}
                        className={`font-bold uppercase border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setactivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider pitches={pitchs} activedTab={activedTab}></CustomSlider>
            </div>
            <div className='w-full flex gap-4 mt-8'>
                <img src={banner} alt='banner' className='flex-1 object-contain'></img>
                <img src={banner2} alt='banner' className='flex-1 object-contain'></img>
            </div>
        </div>
    )
}

export default memo(BestPrice)