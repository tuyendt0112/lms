import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetAllOrder, apiDeleteOrder } from "apis";
import defaultt from "assets/default.png";
import moment from "moment";
import icons from "ultils/icons";
import { shifts } from "ultils/constant";
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";

const ManageOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();
    const [order, setOrder] = useState(null);
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });
    const fetchOrderData = async (params) => {
        const response = await apiGetAllOrder({
            ...params,
            limit: process.env.REACT_APP_PITCH_LIMIT,
        });
        if (response.success) {
            setOrder(response.Bookings);
            setCounts(response.totalCount);
        }
    };

    const queryDebounce = useDebounce(watch("q"), 800);
    const queryDebouncePitch = useDebounce(watch("qpitch"), 800);

    // const [debouncedPitch, setDebouncedPitch] = useState("");
    useEffect(() => {
        let queryParams = {};

        if (queryDebouncePitch) {
            queryParams.qpitch = queryDebouncePitch;
        }

        if (queryDebounce) {
            queryParams.q = queryDebounce;
        }

        const searchParams = createSearchParams(queryParams).toString();

        navigate({
            pathname: location.pathname,
            search: searchParams ? `?${searchParams}` : "",
        });
    }, [queryDebounce, queryDebouncePitch]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchOrderData(searchParams);
    }, [params, update]);

    const handleDeletePitch = (bid) => {
        Swal.fire({
            title: "Are you sure",
            text: "Sure friends ?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteOrder(bid);
                if (response.success) toast.success(response.message);
                else toast.error(response.message);
                render();
            }
        });
    };
    return (
        <div className="w-full flex flex-col gap-4 px-4 ">
            {/* {editPitch && (
        <div className="absolute inset-0 win-h-screen bg-gray-100 z-50">
          <UpdatePitch
            editPitch={editPitch}
            render={render}
            setEditPitch={setEditPitch}
          />
        </div>
      )} */}
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage Order</h1>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex w-full justify-end items-center px-1">
                    {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
                    <form className="w-[300px]">
                        <InputForm
                            id="qpitch"
                            register={register}
                            errors={errors}
                            fullWidth
                            transform
                            placeholder="Search pitch ..."
                        />
                    </form>
                </div>
                <div className="flex w-full justify-end items-center px-1">
                    {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
                    <form className="w-[300px]">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            transform
                            placeholder="Search status ..."
                        />
                    </form>
                </div>
            </div>

            <table className="table-auto w-full ">
                <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-sky-900 text-white  py-2">
                        <th className="px-4 py-2 text-center h-[60px] rounded-tl-lg">#</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Thumb</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Pitch</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Shift</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Booking By</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Total Price</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Status</th>
                        <th className="px-4 py-2 text-center h-[60px] ">Booked At</th>
                        <th className="px-4 py-2 text-center  h-[60px] rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {order?.map((el, index) => (
                        <tr
                            className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
                            key={el._id}
                        >
                            <td className="text-center px-6 py-5 ">
                                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                    process.env.REACT_APP_PITCH_LIMIT +
                                    index +
                                    1}
                            </td>
                            <td className="text-center py-2">
                                <div className="flex items-center justify-center">
                                    {el.pitch?.thumb ? (
                                        <img
                                            src={el.pitch?.thumb}
                                            alt="thumb"
                                            className="w-20 h-[70px] object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={defaultt}
                                            alt="thumb"
                                            className="w-20 h-[70px] object-cover"
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="text-center py-2">{el?.pitch?.title}</td>
                            <td className="text-center py-2">
                                {shifts.find((s) => +s.value === +el.shift)?.time}
                            </td>
                            <td className="text-center py-2">{`${el.bookingBy?.firstname} ${el.bookingBy?.lastname} `}</td>
                            <td className="text-center py-2">{el.total}</td>
                            <td className="text-center py-2">{el.status}</td>
                            <td className="text-center py-2">
                                {moment(el.createdAt).format("DD/MM/YYYY")}
                            </td>
                            <td className="text-center py-2">
                                <div>
                                    <span onClick={() => handleDeletePitch(el._id)} className='flex items-center justify-center text-2xl text-red-500 hover:text-red-700 cursor-pointer'><MdDeleteForever /></span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end my-8">
                <Pagination totalCount={counts} type="orders" />
            </div>
        </div>
    );
};

export default ManageOrder;
