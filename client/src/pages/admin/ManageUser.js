import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers } from 'apis/user'
import { roles } from 'ultils/constant'
import moment from 'moment'
import { InputFields, Pagination } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
const ManageUser = () => {
    const [user, setUsers] = useState(null)
    const [queries, setQueries] = useState({
        q: ""
    })
    const [params] = useSearchParams()
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_PITCH_LIMIT })
        if (response.success) setUsers(response)
    }
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
    }, [queriesDebounce, params])

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
                <table className='table-auto mb-6 text-left w-full'>
                    <thead className='font-bold bg-gray-700 text-[17px] border border-gray-500 text-white'>
                        <tr>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Fullname</th>
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
                                // Ứng với mỗi giá trị sẽ có 1 dòng
                                <tr key={el.id} className='border border-gray-500'>
                                    <td className='py-2 px-4'>{index + 1}</td>
                                    <td className='py-2 px-4'>{el.email}</td>
                                    <td className='py-2 px-4'>{`${el.firstname} ${el.lastname}`}</td>
                                    {/*
                                     * Tìm trong list roles (bên ultili) nếu có thì trả về object nên trỏ tiếp tới value để in
                                    */}
                                    <td className='py-2 px-4'>{roles.find(role => role.code === +el.role)?.value}</td>
                                    <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='py-2 px-4'>{el.isBlocked ? 'Blocked' : 'Active'}</td>
                                    <td className='py-2 px-4'>
                                        <span className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                                        <span className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className='w-full flex justify-end'>
                    <Pagination
                        totalCount={user?.counts} />
                </div>
            </div>
        </div>
    )
}

export default ManageUser