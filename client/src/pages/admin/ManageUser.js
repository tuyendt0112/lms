import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUserByAdmin, apiDeleteUserByAdmin } from 'apis/user'
import { roles } from 'ultils/constant'
import moment from 'moment'
import { InputFields, Pagination, InputForm, Select, Button } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
const ManageUser = () => {
    const { handleSubmit, register, formState: { errors } } = useForm({
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        status: '',
    })
    const [user, setUsers] = useState(null)
    const [queries, setQueries] = useState({
        q: ""
    })
    const [update, setUpdate] = useState(false)
    const [editUser, setEditUser] = useState(null)
    const [params] = useSearchParams()
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_PITCH_LIMIT })
        if (response.success) setUsers(response)
    }
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    {/*
    Mỗi 0.8s thì mới cập nhật 
    Hàm dưới nghĩa là chừng nào giá trị queriesDebounce thay đổi (0.5/1 lần) thì mới gọi API,
    */}
    const queriesDebounce = useDebounce(queries.q, 500)

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        // console.log("Check Queries", queries)
        if (queriesDebounce) queries.q = queriesDebounce
        fetchUsers(queries)
    }, [queriesDebounce, params, update])


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
    // console.log(editUser)
    // console.log('q: ', queries?.q)
    // console.log(user.counts)
    // console.log("SEARCH PARAMS", useSearchParams())
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Manage User</span>
            </h1>
            <div className='w-full p-4'>
                <div className='flex justify-end py-4'>
                    <InputFields
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w350'
                        placeholder='Search by name or email...'
                        isHideLabel
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editUser && <Button type='submit'>Update</Button >}
                    <table className='table-auto mb-6 text-left w-full'>
                        <thead className='font-bold bg-gray-700 text-[17px] border border-gray-500 text-white'>
                            <tr>
                                <th className='px-4 py-2'>#</th>
                                <th className='px-4 py-2'>Email</th>
                                <th className='px-4 py-2'>First name</th>
                                <th className='px-4 py-2'>Last name</th>
                                <th className='px-4 py-2'>Role</th>
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
                                        <td className='py-2 px-4'>{index + 1}</td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <InputForm
                                                    register={register}
                                                    fullWidth
                                                    errors={errors}
                                                    defaultValue={editUser?.email}
                                                    id={'email'}
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
                                                    defaultValue={editUser?.firstname}
                                                    id={'firstname'}
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
                                                    defaultValue={editUser?.lastname}
                                                    id={'lastname'}
                                                    validate={{ required: 'Enter your last name' }}
                                                />
                                                : <span>{el.lastname}</span>}
                                        </td>
                                        {/*
                                     * Tìm trong list roles (bên ultili) nếu có thì trả về object nên trỏ tiếp tới value để in
                                    */}
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <Select />
                                                : <span>{roles.find(role => role.code === +el.role)?.value}</span>}
                                        </td>
                                        <td className='py-2 px-4'>
                                            {editUser?._id === el._id
                                                ? <Select />
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