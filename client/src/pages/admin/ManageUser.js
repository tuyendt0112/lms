import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUserByAdmin, apiDeleteUserByAdmin } from 'apis/user'
import { roles, blockStatus } from 'ultils/constant'
import moment from 'moment'
import { Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'

const ManageUser = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const { handleSubmit, register, formState: { errors }, reset, watch } = useForm()
    const [user, setUsers] = useState(null)
    const [update, setUpdate] = useState(false)
    const [editUser, setEditUser] = useState(null)
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_PITCH_LIMIT })
        if (response.success) setUsers(response)
    }
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    {/*
    Mỗi 0.5s thì mới cập nhật 
    Hàm dưới nghĩa là chừng nào giá trị queriesDebounce thay đổi (0.5/1 lần) thì mới gọi API,
    */}
    const queryDecounce = useDebounce(watch('q'), 500)

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

    // useEffect(() => {
    //     const searchParams = Object.fromEntries([...params])
    //     fetchPitches(searchParams)
    // }, [params])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchUsers(searchParams)
    }, [params, update])

    // useEffect(() => {
    //     const queries = Object.fromEntries([...params])
    //     // console.log("Check Queries", queries)
    //     if (queriesDebounce) queries.q = queriesDebounce
    //     fetchUsers(queries)
    // }, [queriesDebounce, params, update])


    const handleUpdate = async (data) => {
        const response = await apiUpdateUserByAdmin(data, editUser._id)
        if (response.success) {
            setEditUser(null)
            render()
            toast.success(response.mes)
        }
        else {
            toast.error(response.mes)
        }
    }
    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: "Are you sure...",
            text: 'Delete User ?',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUserByAdmin(uid)
                if (response.success) {
                    render()
                    toast.success(response.mes)
                }
                else {
                    toast.error(response.mes)
                }
            }
        })
    }

    useEffect(() => {
        if (editUser) {
            reset({
                email: editUser.email,
                firstname: editUser.firstname,
                lastname: editUser.lastname,
                role: editUser.role,
                isBlocked: editUser.isBlocked,
            })
        }
    }, [editUser])

    return (
        <div className={clsx('w-full', editUser && 'pl-10')}>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Manage User</span>
            </h1>
            <div className='w-full p-4'>
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
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editUser && <Button type='submit'>Update</Button >}
                    <table className='table-auto mb-6 text-left w-full'>
                        <thead className='font-bold bg-gray-700 text-[17px] border border-gray-500 text-white'>
                            <tr>
                                <th className='px-4 py-2 w-[50px]'>#</th>
                                <th className='px-4 py-2 w-[270px]'>Email</th>
                                <th className='px-4 py-2'>First name</th>
                                <th className='px-4 py-2'>Last name</th>
                                <th className='px-4 py-2 w-[150px]'>Role</th>
                                <th className='px-4 py-2'>Create At</th>
                                {/* <th>Address</th> */}
                                <th className='px-4 py-2'>Status</th>
                                <th className='px-4 py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user?.users?.map((el, index) => (
                                    <tr key={el._id} className='border border-gray-500'>
                                        <td className='text-center py-2'>
                                            {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PITCH_LIMIT) + index + 1}
                                        </td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'email'}
                                                    placeholder='Email'
                                                    validate={{
                                                        required: 'Enter your email',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    }}
                                                />
                                                : <span>{el.email}</span>}
                                        </td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'firstname'}
                                                    placeholder='First name'
                                                    validate={{ required: 'Enter your first name' }}
                                                />
                                                : <span>{el.firstname}</span>}
                                        </td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'lastname'}
                                                    placeholder='Last name'
                                                    validate={{ required: 'Enter your last name' }}
                                                />
                                                : <span>{el.lastname}</span>}
                                        </td>
                                        {/*
                                     * Tìm trong list roles (bên ultili) nếu có thì trả về object nên trỏ tiếp tới value để in
                                    */}
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <Select
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'role'}
                                                    validate={{ required: 'Plseae Select' }}
                                                    options={roles} />
                                                : <span>{roles.find(role => role.code === +el.role)?.value}</span>}
                                        </td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <Select
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'isBlocked'}
                                                    validate={{ required: 'Plseae Select' }}
                                                    options={blockStatus} />
                                                : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                                        </td>
                                        <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <span onClick={() => setEditUser(null)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span>
                                                : <span onClick={() => setEditUser(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                                            }
                                            <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </form>

                <div className='w-full flex justify-end'>
                    <Pagination
                        totalCount={user?.counts} />
                </div>
            </div>
        </div >
    )
}

export default ManageUser