import React, { useEffect, useState } from 'react'
import { InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiGetPitches } from 'apis'
import defaultt from 'assets/default.png'
import moment from 'moment'
import icons from 'ultils/icons'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
const { AiFillStar } = icons

const ManagePitch = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const [pitches, setPitches] = useState(null)
    const [counts, setCounts] = useState(0)
    // const handleManagePitch = (data) => {
    //     console.log(data)
    // }
    const fetchPitches = async (params) => {
        const response = await apiGetPitches({ ...params, limit: process.env.REACT_APP_PITCH_LIMIT })
        if (response.success) {
            setPitches(response.pitches)
            setCounts(response.counts)
        }
    }

    const queryDecounce = useDebounce(watch('q'), 800)
    // const queryDecounce = useDebounce(queries.q, 500)

    useEffect(() => {
        if (queryDecounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDecounce }).toString()
            })
        } else {
            navigate({
                pathname: location.pathname,
            })
        }
    }, [queryDecounce])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])

        fetchPitches(searchParams)
    }, [params])
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4 border-b w-full bg-gray-500 flex justify-between items-center fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Manage Pitches</h1>
            </div>
            <div className='flex w-full justify-end items-center px-4'>
                {/* <form className='w-[45%]' onSubmit={handleSubmit(handleManagePitch)}> */}
                <form className='w-[45%]' >
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder='Search products by title, description ...' />
                </form>
            </div>
            <table className='table-auto '>
                <thead >
                    <tr className='border border-white bg-sky-900 text-white  py-2'>
                        <th className='px-4 py-2 text-center'>Order</th>
                        <th className='px-4 py-2 text-center'>Thumb</th>
                        <th className='px-4 py-2 text-center'>Title</th>
                        <th className='px-4 py-2 text-center'>Address</th>
                        <th className='px-4 py-2 text-center'>Brand</th>
                        <th className='px-4 py-2 text-center'>Category</th>
                        <th className='px-4 py-2 text-center'>Price</th>
                        <th className='px-4 py-2 text-center'>Ratings</th>
                        <th className='px-4 py-2 text-center'>CreateAt</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        pitches?.map((el, index) => (
                            <tr className='border-b' key={el._id}>
                                <td className='text-center py-2'>
                                    {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PITCH_LIMIT) + index + 1}
                                </td>
                                <td className='text-center py-2'>
                                    {el.thumb ? <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover' /> : <img src={defaultt} alt='thumb' className='w-12 h-12 object-cover' />}
                                </td>
                                <td className='text-center py-2'>{el.title}</td>
                                <td className='text-center py-2'>{el.address}</td>
                                <td className='text-center py-2'>{el.brand}</td>
                                <td className='text-center py-2'>{el.category}</td>
                                <td className='text-center py-2'>{el.price}</td>
                                <td className='flex items-center justify-center py-5'>{el.totalRatings}<AiFillStar className='ml-1' /></td>
                                <td className='text-center py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className='w-full flex justify-end my-8'>
                <Pagination totalCount={counts} />

            </div>
        </div>
    )
}

export default ManagePitch