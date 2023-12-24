import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Breadcrumb, Pitch, SearchItem, InputSelect, Pagination, InputForm } from 'components'
import { apiGetPitches, apiGetLecturers, apiGetLecturer } from 'apis'
import Masonry from 'react-masonry-css'
import { sorts } from 'ultils/constant'
import useDebounce from 'hooks/useDebounce'
import Lecturer from 'components/products/Lecturer'
const Lecturers = () => {
    const navigate = useNavigate()
    const [pitches, setpitches] = useState(null)
    const [activeClick, setactiveClick] = useState(null)
    const [params] = useSearchParams()
    const [sort, setSort] = useState('')
    const { category } = useParams()
    const [searching, setSearching] = useState('')
    const [Lecturers, setLecturers] = useState(null);
    const [counts, setCounts] = useState(0);
    const fetchLecturers = async (queries) => {
        const response = await apiGetLecturer(queries)
        if (response.success) {
            setLecturers(response);
            setCounts(response.counts);
        }
    };

    // const fetchProductsByCategory = async (queries) => {
    //   if (category && category !== 'pitches') queries.category = category
    //   const response = await apiGetPitches(queries)
    //   if (response.success) setpitches(response)
    // }

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        let priceQuery = {}
        if (queries.to && queries.from) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } }
                ]
            }
            delete queries.price
        } else {
            if (queries.from) queries.price = { gte: queries.from }
            if (queries.to) queries.price = { lte: queries.to }
        }
        delete queries.to
        delete queries.from
        const q = { ...priceQuery, ...queries }
        fetchLecturers(q)
        window.scrollTo(0, 0)
    }, [params])

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setactiveClick(null)
        else setactiveClick(name)
    }, [activeClick])

    const changeValue = useCallback((value) => {
        setSort(value)
    }, [sort])
    console.log(Lecturers)
    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>Lecturers</h3>
                    <Breadcrumb category='Lecturers'></Breadcrumb>
                </div>
            </div>
            <div className='w-main border p-4 flex justify-between mt-8 m-auto gap-3'>
                <div className='w-1/5 flex flex-col gap-3  '>
                    <span className='font-semibold text-sm '>Search</span>
                    <input
                        onChange={(e) => setSearching(e.target.value)}
                        type='type'
                        value={searching}
                        id='q'
                        className='form-input my-auto rounded-md w-full text-sm mb-1 '
                    />
                </div>
                <div className='w-1/5 flex flex-col gap-3'>
                    <span className='font-semibold text-sm'>Sort by</span>
                    <div className='w-full'>
                        <InputSelect changeValue={changeValue} value={sort} options={sorts}></InputSelect>
                    </div>
                </div>
            </div>
            <div className='mt-8 w-main m-auto'>
                <Masonry
                    breakpointCols={1}
                    className="my-masonry-grid flex mx-[-10px] pl-3"
                    columnClassName="my-masonry-grid_column">
                    {Lecturers?.users?.map(el => (
                        <div >
                            <Lecturer
                                key={el._id}
                                pid={el._id}
                                pitchData={el}
                                normal={true}
                            >
                            </Lecturer>
                        </div>
                    ))}
                </Masonry>
            </div>
            <div className='w-main m-auto my-4 flex justify-end'>
                <Pagination totalCount={counts} type="Lecturers" />
            </div>
            <div className='w-full h-[500px]'></div>
        </div>
    )
}


export default Lecturers