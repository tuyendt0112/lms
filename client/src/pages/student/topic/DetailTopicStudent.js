import React, { useCallback, useEffect, useState } from "react"
import { Button, InputForm, MarkDownEditor, Loading } from "components"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { validate } from "ultils/helper"
import { toast } from "react-toastify"
import {
    apiGetAllDepartment,
    apiGetMajorByDepartment,
    apiCreateTopic,
    apiGetSchoolYears,
    apiGetUsers,
    apiGetLecturer,
    apiCreateTask,
    apiGetTasks,
    apiDeleteTask,
    apiUpdateTask
} from "apis"
import { showModal } from "store/app/appSilice"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import icons from "ultils/icons"
import moment from "moment"
import DOMPurify from "dompurify"
import Swal from "sweetalert2"

const DetailTopicLecturer = ({ onDetail, setOnDetail, render }) => {
    const { FaCalendarAlt } = icons
    const dispatch = useDispatch()
    const [Files, setFiles] = useState(null);

    const [selectedDateEnd, setSelectedDateEnd] = useState(null)
    const [selectedDateStart, setSelectedDateStart] = useState(null)
    const [task, setTask] = useState(null)
    const [selectTask, setSelectTask] = useState(null)
    const [updateTask, setUpdateTask] = useState(false)
    const fetchTask = async () => {
        const response = await apiGetTasks()
        console.log("TASK", response)
        if (response.success) setTask(response.tasks)
    }
    useEffect(() => {
        fetchTask()
    }, [updateTask])
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm()

    const [payload, setPayload] = useState({
        description: "",
    })

    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback(
        (e) => {
            setPayload(e)
        },
        [payload]
    )


    const handleSubmitTask = async (data) => {
        // const invalids = validate(payload, setInvalidFields)
        // if (invalids === 0) {
        const finalPayload = {
            ...data,
        }
        const formData = new FormData();
        for (let i of Object.entries(finalPayload)) {
            formData.append(i[0], i[1]);
        }
        if (Files) {
            formData.append("file", Files);
        }
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        window.scrollTo(0, 0);
        const response = await apiUpdateTask(formData);
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
            reset();
            setPayload({
                content: "",
            })
            setUpdateTask(!updateTask)
            toast.success(response.mes);
        } else {
            toast.error(response.mes);
        }
    }

    console.log(task)
    return (
        <div className="w-full flex flex-col gap-4 px-4 relative">
            <div className="p-4 border-b  bg-gray-100 flex justify-between items-center  top-0 left-[327px] right-0">
                <h1 className="text-3xl font-bold tracking-tight">Detail Topic</h1>
                <div className='flex gap-2'>

                    <span
                        className="text-main hover:underline cursor-pointer"
                        onClick={() => setOnDetail(null)}
                    >
                        Cancel
                    </span>
                </div>
            </div>
            <div className='w-full flex justify-center'>
                <div className='p-4 flex flex-col gap-2 shadow-2xl w-[400px]'>
                    <span>
                        <label className='font-bold'>Title:</label> {onDetail?.title}
                    </span>
                    <span>
                        <label className='font-bold'>School Year: </label>{onDetail?.schoolYear}
                    </span>
                    <span>
                        <label className='font-bold'>Major:</label> {onDetail?.major}
                    </span>
                    <span>
                        <label className='font-bold'>Department: </label>{onDetail?.department}
                    </span>
                    <span>
                        <label className='font-bold'>Instructors:</label> {onDetail?.instructors?.firstname} {onDetail?.instructors?.lastname}
                    </span>
                    <span>
                        <label className='font-bold'>Reviewer:</label> {onDetail?.reviewer?.firstname} {onDetail?.reviewer?.lastname}
                    </span>
                    <span>
                        <label className='font-bold'>Students: </label>{onDetail?.students?.map((el) =>
                        (
                            <span>{el.firstname} {el.lastname}, </span>
                        ))}
                    </span>
                    <span className="line-clamp-1">
                        <label className='font-bold'>Date Start: </label>
                        {moment(onDetail?.DateStart).format("DD/MM/YYYY")}
                        <label className='font-bold ml-2'>Date End: </label>
                        {moment(onDetail?.DateEnd).format("DD/MM/YYYY")}
                    </span>
                    <span >
                        {
                            onDetail?.status === 'Pending' ?
                                <>
                                    <label className='font-bold'>Status: </label>
                                    <span className='text-yellow-500'>{onDetail?.status}</span>
                                </>
                                :
                                <>
                                    <label className='font-bold'>Status: </label>
                                    <span className='text-green-500'>{onDetail?.status}</span>
                                </>
                        }

                    </span>
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-2xl font-bold tracking-tight">Current Task</h1>
                <div className="flex flex-col gap-2">
                    {task?.map(el => (
                        <div className="flex flex-col py-2 px-2 gap-1 border-solid border-2 border-black rounded-lg">
                            <div className="flex justify-between">
                                <div>
                                    <span>
                                        <label className='font-bold'>Title:</label> {el?.title}
                                    </span>
                                </div>
                            </div>
                            <span className="line-clamp-1">
                                <label className='font-bold'>Open at: </label>
                                {moment(el?.DateStart).format("DD/MM/YYYY")}
                            </span>
                            <span className="line-clamp-1">
                                <label className='font-bold'>Dead line: </label>
                                {moment(el?.DateEnd).format("DD/MM/YYYY")}
                            </span>
                            <span>
                                {el?.status === 'Not Submit' ?
                                    <>
                                        <label className='font-bold mr-1'>Status:</label>
                                        <span className="text-red-500">{el?.status}</span>
                                    </>
                                    :
                                    <>
                                        <label className='font-bold mr-1'>Status:</label>
                                        <span className="text-green-500">{el?.status}</span>
                                    </>
                                }
                            </span>
                            <span>
                                <label className='font-bold'>Description:</label>
                                <div
                                    className="text-sm line-clamp-[1] w-[400px]"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(el?.description[0]),
                                    }}
                                ></div>
                            </span>
                            <span>
                                <label className='font-bold'>Your Submit:</label>
                                <span className="ml-1">{el?.file}</span>
                            </span>
                            <hr className="border-top-4 border-black mt-2"></hr>
                            <div className="flex flex-col gap-2 py-2">
                                <h4>Submit File</h4>
                                <form enctype="multipart/form-data">
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="application/pdf"
                                        require="true"
                                        onChange={(e) => setFiles(e.target.files[0])}
                                        onClick={() => setSelectTask(el._id)}
                                    ></input>
                                </form>
                            </div>
                            {Files && selectTask === el._id &&
                                <button
                                    onClick={() => handleSubmitTask(el)}
                                    className="text-white bg-blue-500 border-2 border-blue-700 hover:bg-blue-800 duration-300 my-4 py-1 w-[100px] rounded-3xl">
                                    Submit
                                </button>
                            }

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default DetailTopicLecturer