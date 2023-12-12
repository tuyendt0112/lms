import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUserByAdmin, apiDeleteUserByAdmin } from 'apis/user'
import { roles, blockStatus } from 'ultils/constant'
import moment from 'moment'
import { Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams, createSearchParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import icons from 'ultils/icons'

const { FaRegEdit,
    MdDeleteForever, FaSave, TiCancel } = icons
const ManageUser = () => {
    const [open, setOpen] = useOutletContext();
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
        }
        else {
            if (!editUser)
                navigate({
                    pathname: location.pathname,
                })
        }
    }, [queryDecounce])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchUsers(searchParams)
        setEditUser(null)
    }, [params, update])

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
        <div className="w-full flex flex-col gap-4 px-4">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage User</h1>
            </div>
            <div className='w-full p-4'>
                <div className='flex w-full justify-end items-center px-1 pb-4'>
                    {/* <form className='w-[45%]' onSubmit={handleSubmit(handleManagePitch)}> */}
                    <form className='w-[45%] ' >
                        <InputForm
                            id='q'
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder='Search products by title, description ...' />
                    </form>
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <table className='table-auto w-full '>
                        <thead className='text-md  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr className='bg-sky-900 text-white  py-2'>
                                <th className='px-4 py-2 text-center h-[60px] w-[45px] rounded-tl-lg'>#</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[210px]'>Email</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[120px]'>First name</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[120px]'>Last name</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[130px]'>Role</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[130px]'>Status</th>
                                <th className='px-4 py-2 text-center h-[60px] w-[140px]'>Create At</th>
                                {/* <th>Address</th> */}
                                <th className='px-4 py-2 w-[140px] rounded-tr-lg'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user?.users?.map((el, index) => (
                                    <tr key={el._id} className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'>
                                        <td className='px-6 py-5 text-center'>
                                            {((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PITCH_LIMIT) + index + 1}
                                        </td>
                                        <td className='px-6 py-5 text-center'>
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
                                                    txtSmall
                                                />
                                                : <span>{el.email}</span>}
                                        </td>
                                        <td className='px-6 py-5 text-center'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'firstname'}
                                                    placeholder='First name'
                                                    validate={{ required: 'Enter your first name' }}
                                                    txtSmall
                                                />
                                                : <span>{el.firstname}</span>}
                                        </td>
                                        <td className='px-6 py-5 text-center'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'lastname'}
                                                    placeholder='Last name'
                                                    validate={{ required: 'Enter your last name' }}
                                                    txtSmall
                                                />
                                                : <span>{el.lastname}</span>}
                                        </td>
                                        {/*
                                     * Tìm trong list roles (bên ultili) nếu có thì trả về object nên trỏ tiếp tới value để in
                                    */}
                                        <td className='px-6 py-5 text-center'>
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
                                        <td className='px-6 py-5 text-center'>
                                            {editUser?._id === el._id
                                                ? <Select
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    id={'isBlocked'}
                                                    validate={{ required: 'Plseae Select' }}
                                                    options={blockStatus} />
                                                : <span>{blockStatus.find(status => status.code === +el.isBlocked)?.value}</span>}
                                        </td>
                                        <td className='px-6 py-5 text-center'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                        <td className='text-center'>
                                            <div className='flex items-center justify-center '>
                                                {editUser?._id === el._id
                                                    ?
                                                    <>
                                                        <button className='px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer' type='submit'><FaSave /></button>
                                                        <span onClick={() => setEditUser(null)} className='px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer'><TiCancel /></span>
                                                    </>
                                                    :
                                                    <>
                                                        <span onClick={() => setEditUser(el)} className='px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer'><FaRegEdit /></span>
                                                        <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer'><MdDeleteForever /></span>
                                                    </>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </form>

                <div className='w-full flex justify-end mt-2'>
                    <Pagination
                        totalCount={user?.counts}
                        type='users' />
                </div>
            </div>
        </div >
    )
}

export default ManageUser