import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiGetCategories, apiDeleteCategory } from 'apis'
import defaultt from 'assets/default.png'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import Swal from 'sweetalert2'
import UpdateCategory from './UpdateCategory'
import { toast } from 'react-toastify'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'


const ManageCategory = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const { register, formState: { errors }, watch } = useForm()
    const [pitches, setPitches] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editPitch, setEditPitch] = useState(null)
    const [update, setUpdate] = useState(false)

    const render = useCallback(() => {
        setUpdate(!update)
    })
    const fetchPitches = async (params) => {
        const response = await apiGetCategories({ ...params, limit: process.env.REACT_APP_PITCH_LIMIT })
        if (response.success) {
            setPitches(response.pitchCategories)
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
    }, [params, update])

    const handleDeletePitch = (pid) => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Sure friends ?',
            icon: 'warning',
            showCancelButton: true
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteCategory(pid)
                if (response.success) toast.success(response.mes)
                else toast.error(response.mes)
                render()
            }
        })
    }
    return (
        <div className='w-full flex flex-col gap-4 px-4 relative'>
            {editPitch &&
                <div className='absolute inset-0 win-h-screen bg-gray-100 z-50'>
                    <UpdateCategory
                        editPitch={editPitch}
                        render={render}
                        setEditPitch={setEditPitch}
                    />
                </div>
            }
            <div className='p-4 border-b w-full  flex justify-between items-center '>
                <h1 className='text-3xl font-bold tracking-tight'>Manage Category</h1>
            </div>
            <div className='flex w-full justify-end items-center px-1'>
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
            <table className='table-auto w-full '>
                <thead className='text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr className='bg-sky-900 text-white  py-2'>
                        <th className='px-4 py-2 text-center h-[60px] rounded-tl-lg'>#</th>
                        <th className='px-4 py-2 text-center h-[60px] w-[30px] '>Thumb</th>
                        <th className='px-4 py-2 text-center h-[60px] '>Title</th>
                        <th className='px-4 py-2 text-center  h-[60px] w-[30px] rounded-tr-lg'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pitches?.map((el, index) => (
                            <tr className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"' key={el._id}>
                                <td className='text-center py-2'>
                                    {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PITCH_LIMIT) + index + 1}
                                </td>
                                <td className='text-center py-2'>
                                    <div className='flex items-center justify-center'>
                                        {el.thumb ? <img src={el.thumb} alt='thumb' className='w-[80px] h-[70px]  object-cover ' /> : <img src={defaultt} alt='thumb' className='w-[80px] h-[70px] object-cover' />}
                                    </div>
                                </td>
                                <td className='text-center py-2'>{el.title}</td>
                                <td className='text-center py-2'>
                                    <div className='flex items-center justify-center'>
                                        <span
                                            className='text-green-500 hover:text-green-700 cursor-pointer px-2 text-2xl'
                                            onClick={() => setEditPitch(el)}>
                                            <FaRegEdit />
                                        </span>
                                        <span
                                            onClick={() => handleDeletePitch(el._id)}
                                            className='text-red-500 hover:text-red-700 cursor-pointer px-2 text-2xl'>
                                            <MdDeleteForever />
                                        </span>
                                    </div>

                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className='w-full flex justify-end my-8'>
                <Pagination totalCount={counts} type='category' />
            </div>
        </div>
    )
}

export default ManageCategory