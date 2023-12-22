import React, { useEffect, useState, useCallback } from "react";
import {
    apiGetSchoolYears,
    apiUpdateSchoolYears,
    apiDeleteSchoolYears
} from "apis";
import { roles, blockStatus } from "ultils/constant";
import moment from "moment";
import { Pagination, InputForm, Select } from "components";
import useDebounce from "hooks/useDebounce";
import defaultImg from "assets/default.png";
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
    useOutletContext,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import icons from "ultils/icons";
const { FaRegEdit, MdDeleteForever, FaSave, TiCancel } = icons;

const ManageSchoolYear = () => {
    const [open, setOpen] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const [schoolyear, setSchoolYear] = useState(null);
    const [update, setUpdate] = useState(false);
    const [editSchoolYear, setEditSchoolYear] = useState(null);
    const fetchSchoolYear = async (params) => {
        const response = await apiGetSchoolYears({
            ...params,
            limit: process.env.REACT_APP_PITCH_LIMIT,
        });
        console.log("CHECK", response)
        if (response.success) setSchoolYear(response.SchoolYears);
    };

    const handleUpdate = async (data) => {
        const response = await apiUpdateSchoolYears(data, editSchoolYear._id);
        if (response.success) {
            setEditSchoolYear(null);
            render();
            toast.success(response.mes);
        } else {
            toast.error(response.mes);
        }
    };

    const handleDeleteUser = (sid) => {
        Swal.fire({
            title: "Are you sure...",
            text: "Delete School Year ?",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteSchoolYears(sid);
                if (response.success) {
                    render();
                    toast.success(response.mes);
                } else {
                    toast.error(response.mes);
                }
            }
        });
    };

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);
    {
        /*
        Mỗi 0.5s thì mới cập nhật 
        Hàm dưới nghĩa là chừng nào giá trị queriesDebounce thay đổi (0.5/1 lần) thì mới gọi API,
        */
    }
    const queryDebounce = useDebounce(watch("q"), 500);
    useEffect(() => {
        if (queryDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString(),
            });
        } else {
            if (!editSchoolYear)
                navigate({
                    pathname: location.pathname,
                });
        }
    }, [queryDebounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchSchoolYear(searchParams);
        setEditSchoolYear(null);
    }, [params, update]);



    useEffect(() => {
        if (editSchoolYear) {
            reset({
                title: editSchoolYear.title
            });
        }
    }, [editSchoolYear]);

    return (
        <div className="w-full flex flex-col gap-4 px-4">
            <div className="p-4 border-b w-full flex items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage User</h1>
            </div>
            <div className="w-full p-4">
                <div className="flex w-full justify-end items-center px-1 pb-4">
                    {/* <form className='w-[300px]' onSubmit={handleSubmit(handleManagePitch)}> */}
                    <form className="w-[300px] ">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWidth
                            transform
                            placeholder="Search user by email, name, ..."
                        />
                    </form>
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <table className="table-auto w-full ">
                        <thead className="text-md  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="bg-sky-900 text-white  py-2">
                                <th className="px-4 py-2 text-center h-[60px] w-[45px] rounded-tl-lg">
                                    #
                                </th>
                                <th className="px-4 py-2 text-center h-[60px] w-[120px]">
                                    Title
                                </th>
                                <th className="px-4 py-2 text-center h-[60px] w-[140px]">
                                    Started date
                                </th>
                                <th className="px-4 py-2 text-center h-[60px] w-[140px]">
                                    Ended date
                                </th>
                                {/* <th>Address</th> */}
                                <th className="px-4 py-2 w-[140px] rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schoolyear?.map((el, index) => (
                                <tr
                                    key={el._id}
                                    className='odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700"'
                                >
                                    <td className="px-6 py-5 text-center">
                                        {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                                            process.env.REACT_APP_PITCH_LIMIT +
                                            index +
                                            1}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {editSchoolYear?._id === el._id ? (
                                            <InputForm
                                                register={register}
                                                fullWidth
                                                errors={errors}
                                                id={"title"}
                                                placeholder="School year title ..."
                                                validate={{ required: "Enter school year title" }}
                                                txtSmall
                                            />
                                        ) : (
                                            <span>{el.title}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {moment(el.start).format("MMMM YYYY")}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {moment(el.end).format("MMMM YYYY")}
                                    </td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center ">
                                            {editSchoolYear?._id === el._id ? (
                                                <>
                                                    <button
                                                        className="px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer"
                                                        type="submit"
                                                    >
                                                        <FaSave />
                                                    </button>
                                                    <span
                                                        onClick={() => setEditSchoolYear(null)}
                                                        className="px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <TiCancel />
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span
                                                        onClick={() => setEditSchoolYear(el)}
                                                        className="px-2 text-2xl text-green-500 hover:text-green-700 cursor-pointer"
                                                    >
                                                        <FaRegEdit />
                                                    </span>
                                                    <span
                                                        onClick={() => handleDeleteUser(el._id)}
                                                        className="px-2 text-2xl text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <MdDeleteForever />
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                <div className="w-full flex justify-end mt-2">
                    <Pagination totalCount={schoolyear?.length} type="school years" />
                </div>
            </div>
        </div>
    );
};

export default ManageSchoolYear