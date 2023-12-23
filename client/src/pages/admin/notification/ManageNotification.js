import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetAllNotification, apiDeleteNotification } from "apis";
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import UpdateNotification from "./UpdateNotification";

const ManageNotification = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const {
        register,
        formState: { errors },
        watch,
    } = useForm()
    const [notifications, setNotifications] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editNotification, setEditNotification] = useState(null)
    const [update, setUpdate] = useState(false)

    const render = useCallback(() => {
        setUpdate(!update)
    })
    const fetchNotifitcation = async (params) => {
        const response = await apiGetAllNotification({
            ...params,
            limit: process.env.REACT_APP_MAJOR_LIMIT,
        })
        console.log(response)
        if (response.success) {
            setNotifications(response.Notifications)
            setCounts(response.totalCount)
        }
    }

    const queryDebounce = useDebounce(watch("q"), 800)

    useEffect(() => {
        if (queryDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString(),
            })
        } else {
            navigate({
                pathname: location.pathname,
            })
        }
    }, [queryDebounce])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchNotifitcation(searchParams)
    }, [params, update])

    const handleDeleteNotification = (mid) => {
        Swal.fire({
            title: "Are you sure",
            text: "Sure friends ?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteNotification(mid)
                if (response.success) toast.success(response.message)
                else toast.error(response.message)
                render()
            }
        })
    }
    console.log(notifications)
    return (
        <div className="w-full flex flex-col gap-4 px-4 relative">
            {editNotification && (
                <div className="absolute inset-0 win-h-screen bg-gray-100 z-50">
                    <UpdateNotification
                        render={render}
                        editNotification={editNotification}
                        setEditNotification={setEditNotification}
                    />
                </div>
            )}
            <div className="p-4 border-b w-full  flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage Notifications</h1>
            </div>
            <div className="flex w-full justify-end items-center px-1">
                <form className="w-[300px]">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        transform
                        placeholder="Search notification by title"
                    />
                </form>
            </div>
            <table className="table-auto w-full ">
                <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-sky-900 text-white  py-2">
                        <th className="px-4 py-2 text-center h-[60px] rounded-tl-lg">#</th>
                        <th className="px-4 py-2 text-center h-[60px]  ">Title</th>
                        <th className="px-4 py-2 text-center h-[60px]  ">File</th>
                        <th className="px-4 py-2 text-center h-[60px] rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {notifications?.map((el, index) => (
                        <tr
                            className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
                            key={el._id}
                        >
                            <td className="text-center py-2">
                                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                    process.env.REACT_APP_MAJOR_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td className="text-center py-2">{el.title}</td>
                            <td className="text-center py-2">{el.file}</td>
                            <td className="text-center py-2">
                                <div className="flex items-center justify-center">
                                    <span
                                        className="text-green-500 hover:text-green-700 cursor-pointer px-2 text-2xl"
                                        onClick={() => setEditNotification(el)}
                                    >
                                        <FaRegEdit />
                                    </span>
                                    <span
                                        onClick={() => handleDeleteNotification(el._id)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer px-2 text-2xl"
                                    >
                                        <MdDeleteForever />
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end my-8">
                <Pagination totalCount={counts} type="notifications" />
            </div>
        </div>
    )
}

export default ManageNotification