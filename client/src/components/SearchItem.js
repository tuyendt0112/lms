import React, { memo, useState, useEffect } from 'react'
import icons from '../ultils/icons'
import { apiGetPitches } from '../apis'
import { useNavigate, useParams, createSearchParams } from 'react-router-dom'
import path from '../ultils/path'
import useDebounce from '../hooks/useDebounce'

const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter }) => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [selected, setselected] = useState(0)
    const [bestPrice, setbestPrice] = useState(null)
    const [price, setprice] = useState({
        from: '',
        to: ''
    })

    const fetchBestPricePitch = async () => {
        const response = await apiGetPitches({ sort: '-price', limit: 1 })
        if (response.success) setbestPrice(response.pitches[0]?.price)
    }
    useEffect(() => {
        fetchBestPricePitch()
    }, [])


    const debouncePriceFrom = useDebounce(price.from, 500)
    const debouncePriceTo = useDebounce(price.to, 500)

    useEffect(() => {
        const data = {}
        if (Number(price.from) > 0) data.from = price.from
        if (Number(price.to) > 0) data.to = price.to
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(data).toString()
        })
    }, [debouncePriceFrom, debouncePriceTo])
    return (
        <div className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}
        >
            <span className='capitalize'>{name}</span>
            <AiOutlineDown></AiOutlineDown>
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] border left-0 w-fit p-4 bg-white min-w-[150px]'>
                <div onClick={e => e.stopPropagation()}>
                    <div className='p-4 items-center flex justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VNĐ `}</span>
                        <span onClick={e => {
                            e.stopPropagation()
                            setprice({ from: '', to: '' })
                            changeActiveFilter(null)
                        }} className='underline cursor-pointer hover:text-main'>Reset</span>
                    </div>
                    <div className='flex items-center p-2 gap-2'>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='from'>From</label>
                            <input
                                className='form-input'
                                type='number'
                                id='from'
                                value={price.from}
                                onChange={e => setprice(prev => ({ ...prev, from: e.target.value }))}
                            ></input>
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor='to'>To</label>
                            <input
                                className='form-input'
                                type='number'
                                id='to'
                                value={price.to}
                                onChange={e => setprice(prev => ({ ...prev, to: e.target.value }))}
                            ></input>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default memo(SearchItem)